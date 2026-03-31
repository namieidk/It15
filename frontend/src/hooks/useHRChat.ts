'use client';

import { useState, useEffect, useRef } from 'react';
import * as Ably from 'ably';
import { useRouter } from 'next/navigation';

export interface HRContact {
  employeeId: string;
  name: string;
  role: string;
  department: string;
  profileImage?: string;
}

export interface Message {
  senderId: string;
  receiverId?: string;
  content: string;
  timestamp: string;
  fileUrl?: string;
}

let ablyClient: Ably.Realtime | null = null;

export function useHRChat() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<HRContact | null>(null);
  const [contacts, setContacts] = useState<HRContact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeChat, setActiveChat] = useState<HRContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user: HRContact = JSON.parse(storedUser);
    setCurrentUser(user);

    const fetchDirectory = async () => {
      try {
        const res = await fetch('http://localhost:5076/api/messages/users');
        const data: HRContact[] = await res.json();
        const filtered = data.filter(u => u.employeeId !== user.employeeId);
        setContacts(filtered);
        if (filtered.length > 0) setActiveChat(filtered[0]);
      } catch (err) {
        console.error("HR Directory Load Error:", err);
      } finally {
        setIsReady(true);
      }
    };
    fetchDirectory();
  }, [router]);

  useEffect(() => {
    if (!currentUser || !isReady) return;
    if (!ablyClient) ablyClient = new Ably.Realtime('sHtm4A.lTOpFg:yeyUSF3-dhElihs3wh97KzkCIERx4esrg0SDikHn_fQ');

    const channel = ablyClient.channels.get(`user-${currentUser.employeeId}`);
    channel.subscribe('message', (incoming) => {
      const newMsg = incoming.data as Message;
      if ((!newMsg.content && !newMsg.fileUrl) || newMsg.senderId === currentUser.employeeId) return;
      setMessages(prev => [...prev, newMsg]);
    });

    return () => { channel.unsubscribe(); };
  }, [currentUser, isReady]);

  useEffect(() => {
    if (!activeChat || !currentUser || !isReady) return;
    const url = `http://localhost:5076/api/messages/history?senderId=${currentUser.employeeId}&receiverId=${activeChat.employeeId}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => setMessages([]));
  }, [activeChat, currentUser, isReady]);

  useEffect(() => { 
    scrollRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const handleSend = async (fileUrl?: string) => {
    if (!input.trim() && !fileUrl) return;
    if (!activeChat || !currentUser) return;

    const payload: Message = {
      senderId: currentUser.employeeId,
      receiverId: activeChat.employeeId,
      content: input.toUpperCase(),
      timestamp: new Date().toISOString(),
      fileUrl: fileUrl || undefined
    };
    
    setMessages(prev => [...prev, payload]);
    setInput("");

    await fetch('http://localhost:5076/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'axiom_upload');
    formData.append('cloud_name', 'duxxwlurg');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/duxxwlurg/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        await handleSend(data.secure_url);
      }
    } catch (err) {
      console.error("HR Asset Upload Error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    isReady, currentUser, filteredContacts, activeChat, setActiveChat,
    messages, input, setInput, handleSend, searchTerm, setSearchTerm, 
    scrollRef, setMessages, uploadToCloudinary, isUploading
  };
}