import { useEffect, useState, useCallback, useRef } from 'react';

export function useWebSocket(url: string) {
    const [messages, setMessages] = useState<any[]>([]);
    const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
    const ws = useRef<WebSocket | null>(null);
    const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (ws.current?.readyState === WebSocket.CONNECTING) return;
        
        setStatus('connecting');
        const socket = new WebSocket(url);

        socket.onopen = () => {
            setStatus('connected');
            console.log(`[WebSocket] Connected to ${url}`);
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setMessages((prev) => [...prev, data]);
            } catch (err) {
                console.error('[WebSocket] Failed to parse message:', event.data, err);
            }
        };

        socket.onclose = (event) => {
            setStatus('disconnected');
            console.log(`[WebSocket] Disconnected from ${url}. Code: ${event.code}, Reason: ${event.reason}`);
            
            // Auto-reconnect after 3 seconds
            if (!reconnectTimeout.current) {
                reconnectTimeout.current = setTimeout(() => {
                    console.log('[WebSocket] Attempting to reconnect...');
                    connect();
                }, 3000);
            }
        };

        socket.onerror = (error) => {
            // Detailed error logging
            console.error('[WebSocket] Error occurred:', {
                url,
                readyState: socket.readyState,
                error
            });
        };

        ws.current = socket;
    }, [url]);

    useEffect(() => {
        connect();
        return () => {
            if (ws.current) {
                ws.current.onclose = null; // Prevent reconnection on intentional close
                ws.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, [connect]);

    const sendMessage = (message: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.warn('[WebSocket] Cannot send message, socket not open. State:', ws.current?.readyState);
        }
    };

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return { messages, status, sendMessage, clearMessages };
}
