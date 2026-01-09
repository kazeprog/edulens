'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, ImagePlus, X, Loader2, CheckCircle, HelpCircle, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Function to render text with LaTeX and Links
function renderTextWithLatex(text: string): React.ReactNode {
    // Match both inline ($...$) and display ($$...$$) math
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Regex to match $$...$$ or $...$
    const mathRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
    let match;
    let key = 0;

    // Helper to process text for Links (Markdown and Raw URLs)
    const processTextWithLinks = (textChunk: string) => {
        // Regex for Markdown links [text](url) OR raw URLs http(s)://...
        // Capture groups: 1=text, 2=url (for markdown), 3=url (for raw)
        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)|(https?:\/\/[^\s]+)/g;

        const urlParts: React.ReactNode[] = [];
        let lastUrlIndex = 0;
        let match;

        while ((match = linkRegex.exec(textChunk)) !== null) {
            if (match.index > lastUrlIndex) {
                urlParts.push(textChunk.slice(lastUrlIndex, match.index));
            }

            if (match[1] && match[2]) {
                // Markdown Link: [text](url)
                const text = match[1];
                const url = match[2];
                urlParts.push(
                    <a
                        key={`link-${key++}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-bold"
                    >
                        {text}
                    </a>
                );
            } else if (match[3]) {
                // Raw URL
                const url = match[3];
                urlParts.push(
                    <a
                        key={`link-${key++}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                    >
                        {url}
                    </a>
                );
            }

            lastUrlIndex = match.index + match[0].length;
        }
        if (lastUrlIndex < textChunk.length) {
            urlParts.push(textChunk.slice(lastUrlIndex));
        }
        return urlParts;
    };

    while ((match = mathRegex.exec(text)) !== null) {
        // Add text before the match (processed for links)
        if (match.index > lastIndex) {
            const textBefore = text.slice(lastIndex, match.index);
            parts.push(...processTextWithLinks(textBefore));
        }

        const isDisplay = match[1] !== undefined;
        const latex = match[1] || match[2];

        try {
            const html = katex.renderToString(latex, {
                throwOnError: false,
                displayMode: isDisplay,
            });
            parts.push(
                <span
                    key={`math-${key++}`}
                    dangerouslySetInnerHTML={{ __html: html }}
                    className={isDisplay ? 'block text-center my-2 py-2 overflow-x-auto' : 'inline-block align-middle mx-1'}
                />
            );
        } catch {
            // If KaTeX fails, show original text
            parts.push(<span key={`error-${key++}`}>{match[0]}</span>);
        }

        lastIndex = match.index + match[0].length;
    }

    // Add remaining text (processed for links)
    if (lastIndex < text.length) {
        const textAfter = text.slice(lastIndex);
        parts.push(...processTextWithLinks(textAfter));
    }

    return parts.length > 0 ? parts : text;
}

import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';

export default function ChatInterface() {
    const { user, profile } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const [isTokenReady, setIsTokenReady] = useState(false); // Track if token fetch is complete
    const [isChatEnded, setIsChatEnded] = useState(false);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState<FileList | undefined>(undefined);
    const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get session token (and track when it's ready)
    useEffect(() => {
        const fetchToken = async () => {
            setIsTokenReady(false);
            const supabase = getSupabase();
            if (supabase) {
                const { data } = await supabase.auth.getSession();
                setToken(data.session?.access_token || null);
            }
            setIsTokenReady(true);
        };
        fetchToken();
    }, [user]);

    // Close upload menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isUploadMenuOpen && !(event.target as Element).closest('.upload-menu-container')) {
                setIsUploadMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUploadMenuOpen]);

    const { messages, sendMessage, status } = useChat({
        // Use token as part of the ID to force re-initialization when auth state changes
        id: `chat-${token || 'guest'}`,
        transport: new DefaultChatTransport({
            api: '/api/naruhodo-lens',
            headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        }),
        onFinish: (message) => {
            // Optional: Handle finish
        },
        onError: (error) => {
            if (error.message.includes('Limit exceeded')) {
                alert('1日の質問回数制限に達しました。\nログインすると1日2回、Proプランなら20回まで質問できます！');
            }
        }
    });

    // Check for chat end signal
    useEffect(() => {
        if (messages.length === 0) return;

        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'assistant') {
            // Check text content safely
            let text = (lastMessage as any).content;
            // Handle parts if present (Vercel AI SDK v6)
            if (!text && (lastMessage as any).parts) {
                text = (lastMessage as any).parts
                    .filter((p: any) => p.type === 'text')
                    .map((p: any) => p.text)
                    .join('');
            }

            if (text && text.includes('[END]')) {
                setIsChatEnded(true);
            }
        }
    }, [messages]);

    const isLoading = status === 'streaming' || status === 'submitted';

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Get text content from message parts
    const getTextContent = (parts: Array<{ type: string; text?: string }>) => {
        return parts
            .filter(part => part.type === 'text')
            .map(part => part.text || '')
            .join('');
    };

    // Check if the last AI message ends with the confirmation question
    const lastMessage = messages[messages.length - 1];
    const lastMessageText = lastMessage?.parts ? getTextContent(lastMessage.parts as Array<{ type: string; text?: string }>) : '';
    const showQuickActions = lastMessage?.role === 'assistant' &&
        (lastMessageText.includes('大丈夫？') ||
            lastMessageText.includes('大丈夫かな？') ||
            lastMessageText.includes('いいかな？') ||
            lastMessageText.includes('でしょうか？'));

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!input.trim() && !files?.length) return;

        sendMessage({
            text: input.trim() || 'この問題を解説してください。',
            files: files,
        });

        setInput('');
        setFiles(undefined);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Quick action handlers
    const handleYes = () => {
        sendMessage({
            text: 'はい、大丈夫です。次のステップへ進んでください。',
        });
    };

    const handleNo = () => {
        sendMessage({
            text: 'いいえ、ここがよく分かりません。もっと噛み砕いて教えてください。',
        });
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Limit to 2 files
            const dt = new DataTransfer();
            for (let i = 0; i < Math.min(e.target.files.length, 2); i++) {
                dt.items.add(e.target.files[i]);
            }
            setFiles(dt.files);
        }
    };

    // Remove file from selection
    const removeFile = (index: number) => {
        if (!files) return;
        const dt = new DataTransfer();
        for (let i = 0; i < files.length; i++) {
            if (i !== index) {
                dt.items.add(files[i]);
            }
        }
        setFiles(dt.files.length > 0 ? dt.files : undefined);
        if (fileInputRef.current && dt.files.length === 0) {
            fileInputRef.current.value = '';
        }
    };

    const isSubmitDisabled = status !== 'ready' || (!input.trim() && !files?.length) || isChatEnded || (!!user && !isTokenReady);

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-50 font-sans text-slate-800">
            {/* Header */}
            {/* Header */}
            <div className="flex-shrink-0 z-20">
                <SiteHeader />
            </div>

            {/* Messages Area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">ナルホドレンズへようこそ！</h2>
                        <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-8">
                            問題の画像をアップロードすると、<br />
                            AIが理解度を確認しながら丁寧に解説するよ！
                        </p>

                        <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-blue-600">1</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-700">画像をアップロード</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        問題の画像を送信してね！<br />
                                        解説の画像を送ってくれたら解説のやり方に沿って教えるよ！
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-blue-600">2</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-700">AIとチャット</p>
                                    <p className="text-xs text-slate-500 mt-0.5">ステップごとに丁寧に解説するよ</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-blue-600">3</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold text-slate-700">理解度チェック</p>
                                    <p className="text-xs text-slate-500 mt-0.5">分からなければ何度でも質問OK</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-5 py-4 ${message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100 rounded-tr-sm'
                                : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-sm'
                                }`}
                        >
                            {/* Render message parts */}
                            <div className="space-y-3">
                                {message.parts.map((part, index) => {
                                    if (part.type === 'text') {
                                        return (
                                            <div key={index} className="whitespace-pre-wrap text-[15px] leading-relaxed tracking-wide">
                                                {renderTextWithLatex((part.text || '').replace('[END]', ''))}
                                            </div>
                                        );
                                    }
                                    if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
                                        return (
                                            <img
                                                key={index}
                                                src={part.url}
                                                alt={part.filename || 'Attached image'}
                                                className="w-full max-w-sm object-cover rounded-lg border border-white/20"
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200 shadow-sm rounded-tl-sm">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span className="text-sm font-medium">考え中...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            {showQuickActions && !isLoading && (
                <div className="flex-shrink-0 px-4 pb-2 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex gap-3 max-w-2xl mx-auto">
                        <button
                            onClick={handleYes}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
                        >
                            <CheckCircle className="w-5 h-5" />
                            はい、進む
                        </button>
                        <button
                            onClick={handleNo}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm shadow-lg shadow-slate-100 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200"
                        >
                            <HelpCircle className="w-5 h-5 text-slate-500" />
                            いいえ、詳しく
                        </button>
                    </div>
                </div>
            )}

            {/* File Preview */}
            {files && files.length > 0 && (
                <div className="flex-shrink-0 px-4 pb-2 z-10">
                    <div className="flex gap-3 max-w-2xl mx-auto p-2 bg-white/50 backdrop-blur rounded-xl border border-slate-200/50">
                        {Array.from(files).map((file, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 shadow-sm"
                                />
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center shadow-md hover:bg-slate-700 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0 px-4 pb-4 pt-2 bg-slate-50 z-10">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex items-end gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all relative">
                        {/* Image Upload Button & Menu */}
                        <div className="relative upload-menu-container">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                                className="hidden"
                            />
                            <input
                                type="file"
                                ref={cameraInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                            />

                            {/* Upload Menu */}
                            {isUploadMenuOpen && (
                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            fileInputRef.current?.click();
                                            setIsUploadMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors border-b border-slate-50"
                                    >
                                        <ImageIcon className="w-4 h-4 text-blue-500" />
                                        フォトライブラリ
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            cameraInputRef.current?.click();
                                            setIsUploadMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
                                    >
                                        <Camera className="w-4 h-4 text-blue-500" />
                                        写真を撮る
                                    </button>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsUploadMenuOpen(!isUploadMenuOpen)}
                                disabled={(files?.length ?? 0) >= 2 || isLoading || isChatEnded}
                                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isUploadMenuOpen ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                            >
                                <ImagePlus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Text Input */}
                        <div className="flex-1 relative py-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={files?.length ? "質問を追加（任意）" : "問題の画像をアップロードしてね"}
                                disabled={status !== 'ready' || isChatEnded}
                                className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none text-sm font-medium"
                            />
                        </div>

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none hover:scale-105 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-400 text-[10px] mt-2 font-medium">
                        最大2枚まで画像をアップロードできます
                    </p>
                </div>
            </div>
        </div>
    );
}
