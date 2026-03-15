import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";

// ═══════════════════════════════════════════════════════
// USERS / ACCOUNTS
// Collection: users/{email}
// ═══════════════════════════════════════════════════════
export type UserAccount = {
  email: string;
  password: string;
  role: string;
  name: string;
  telefone?: string;
  cpfCnpj?: string;
  razaoSocial?: string;
  endereco?: string;
  municipio?: string;
  uf?: string;
  ref?: string;
  createdAt?: unknown;
};

export async function getUser(email: string): Promise<UserAccount | null> {
  const snap = await getDoc(doc(db, "users", email));
  return snap.exists() ? (snap.data() as UserAccount) : null;
}

export async function setUser(email: string, data: Partial<UserAccount>) {
  await setDoc(doc(db, "users", email), { ...data, email }, { merge: true });
}

export async function getAllUsers(): Promise<UserAccount[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map(d => d.data() as UserAccount);
}

// ═══════════════════════════════════════════════════════
// PROPOSTAS
// Collection: propostas/{email}
// ═══════════════════════════════════════════════════════
export async function getProposta(email: string): Promise<Record<string, unknown> | null> {
  const snap = await getDoc(doc(db, "propostas", email));
  return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
}

export async function setProposta(email: string, data: Record<string, unknown>) {
  await setDoc(doc(db, "propostas", email), { ...data, userEmail: email, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getAllPropostas(): Promise<Record<string, Record<string, unknown>>> {
  const snap = await getDocs(collection(db, "propostas"));
  const result: Record<string, Record<string, unknown>> = {};
  snap.docs.forEach(d => {
    result[d.id] = d.data() as Record<string, unknown>;
  });
  return result;
}

export function onPropostaChange(email: string, callback: (data: Record<string, unknown> | null) => void): Unsubscribe {
  return onSnapshot(doc(db, "propostas", email), snap => {
    callback(snap.exists() ? (snap.data() as Record<string, unknown>) : null);
  });
}

export function onAllPropostasChange(callback: (data: Record<string, Record<string, unknown>>) => void): Unsubscribe {
  return onSnapshot(collection(db, "propostas"), snap => {
    const result: Record<string, Record<string, unknown>> = {};
    snap.docs.forEach(d => {
      result[d.id] = d.data() as Record<string, unknown>;
    });
    callback(result);
  });
}

// ═══════════════════════════════════════════════════════
// TICKETS (Suporte)
// Collection: tickets (single doc with all tickets array)
// ═══════════════════════════════════════════════════════
export async function getTickets(): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "global", "tickets"));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setTickets(tickets: unknown[]) {
  await setDoc(doc(db, "global", "tickets"), { items: tickets, updatedAt: serverTimestamp() });
}

export function onTicketsChange(callback: (tickets: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "global", "tickets"), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// COMPROVANTES
// Collection: global/comprovantes
// ═══════════════════════════════════════════════════════
export async function getComprovantes(): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "global", "comprovantes"));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setComprovantes(items: unknown[]) {
  await setDoc(doc(db, "global", "comprovantes"), { items, updatedAt: serverTimestamp() });
}

export function onComprovantesChange(callback: (items: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "global", "comprovantes"), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// COMISSÕES
// Collection: global/comissoes
// ═══════════════════════════════════════════════════════
export async function getComissoes(): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "global", "comissoes"));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setComissoes(items: unknown[]) {
  await setDoc(doc(db, "global", "comissoes"), { items, updatedAt: serverTimestamp() });
}

export function onComissoesChange(callback: (items: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "global", "comissoes"), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// PARCEIROS
// Collection: global/parceiros
// ═══════════════════════════════════════════════════════
export async function getParceiros(): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "global", "parceiros"));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setParceiros(items: unknown[]) {
  await setDoc(doc(db, "global", "parceiros"), { items, updatedAt: serverTimestamp() });
}

export function onParceirosChange(callback: (items: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "global", "parceiros"), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// PARCEIRO PIX
// Collection: global/parceiro_pix
// ═══════════════════════════════════════════════════════
export async function getParceiroPix(): Promise<Record<string, unknown>> {
  const snap = await getDoc(doc(db, "global", "parceiro_pix"));
  return snap.exists() ? (snap.data() as Record<string, unknown>) : {};
}

export async function setParceiroPix(data: Record<string, unknown>) {
  await setDoc(doc(db, "global", "parceiro_pix"), { ...data, updatedAt: serverTimestamp() });
}

export function onParceiroPixChange(callback: (data: Record<string, unknown>) => void): Unsubscribe {
  return onSnapshot(doc(db, "global", "parceiro_pix"), snap => {
    callback(snap.exists() ? (snap.data() as Record<string, unknown>) : {});
  });
}

// ═══════════════════════════════════════════════════════
// PAGAMENTOS (per user)
// Collection: pagamentos/{email}
// ═══════════════════════════════════════════════════════
export async function getPagamentos(email: string): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "pagamentos", email));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setPagamentos(email: string, items: unknown[]) {
  await setDoc(doc(db, "pagamentos", email), { items, updatedAt: serverTimestamp() });
}

export function onPagamentosChange(email: string, callback: (items: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "pagamentos", email), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// MEU SITE (per user)
// Collection: meusites/{email}
// ═══════════════════════════════════════════════════════
export async function getMeuSite(email: string): Promise<Record<string, unknown> | null> {
  const snap = await getDoc(doc(db, "meusites", email));
  return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
}

export async function setMeuSite(email: string, data: Record<string, unknown>) {
  await setDoc(doc(db, "meusites", email), { ...data, updatedAt: serverTimestamp() });
}

export function onMeuSiteChange(email: string, callback: (data: Record<string, unknown> | null) => void): Unsubscribe {
  return onSnapshot(doc(db, "meusites", email), snap => {
    callback(snap.exists() ? (snap.data() as Record<string, unknown>) : null);
  });
}

// ═══════════════════════════════════════════════════════
// MENSAGENS (per user)
// Collection: mensagens/{email}
// ═══════════════════════════════════════════════════════
export async function getMensagens(email: string): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "mensagens", email));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setMensagens(email: string, items: unknown[]) {
  await setDoc(doc(db, "mensagens", email), { items, updatedAt: serverTimestamp() });
}

export function onMensagensChange(email: string, callback: (items: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "mensagens", email), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// COMISSÕES CHAT
// Collection: global/comissoes_chat
// ═══════════════════════════════════════════════════════
export async function getComissoesChat(): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "global", "comissoes_chat"));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setComissoesChat(items: unknown[]) {
  await setDoc(doc(db, "global", "comissoes_chat"), { items, updatedAt: serverTimestamp() });
}

export function onComissoesChatChange(callback: (items: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "global", "comissoes_chat"), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// FINANCEIRO PARCEIRO (per user)
// Collection: financeiro/{email}
// ═══════════════════════════════════════════════════════
export async function getFinanceiro(email: string): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "financeiro", email));
  return snap.exists() ? ((snap.data().items || []) as unknown[]) : [];
}

export async function setFinanceiro(email: string, items: unknown[]) {
  await setDoc(doc(db, "financeiro", email), { items, updatedAt: serverTimestamp() });
}

export function onFinanceiroChange(email: string, callback: (items: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "financeiro", email), snap => {
    callback(snap.exists() ? ((snap.data().items || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// CHAT PARCEIRO ↔ ADMIN (per partner email)
// Collection: chat_parceiro/{email}
// ═══════════════════════════════════════════════════════
export async function getChatParceiro(email: string): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "chat_parceiro", email));
  return snap.exists() ? ((snap.data().messages || []) as unknown[]) : [];
}

export async function setChatParceiro(email: string, messages: unknown[]) {
  await setDoc(doc(db, "chat_parceiro", email), { messages, updatedAt: serverTimestamp() });
}

export function onChatParceiroChange(email: string, callback: (messages: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "chat_parceiro", email), snap => {
    callback(snap.exists() ? ((snap.data().messages || []) as unknown[]) : []);
  });
}

// Get all chats (admin view)
export async function getAllChatsParceiro(): Promise<Record<string, unknown[]>> {
  const snap = await getDocs(collection(db, "chat_parceiro"));
  const result: Record<string, unknown[]> = {};
  snap.docs.forEach(d => {
    result[d.id] = (d.data().messages || []) as unknown[];
  });
  return result;
}

export function onAllChatsParceiro(callback: (data: Record<string, unknown[]>) => void): Unsubscribe {
  return onSnapshot(collection(db, "chat_parceiro"), snap => {
    const result: Record<string, unknown[]> = {};
    snap.docs.forEach(d => {
      result[d.id] = (d.data().messages || []) as unknown[];
    });
    callback(result);
  });
}

// ═══════════════════════════════════════════════════════
// NOTIF READ STATE (per user)
// Collection: notif_read/{email}
// ═══════════════════════════════════════════════════════
export async function getNotifRead(email: string): Promise<string[]> {
  const snap = await getDoc(doc(db, "notif_read", email));
  return snap.exists() ? ((snap.data().ids || []) as string[]) : [];
}

export async function setNotifRead(email: string, ids: string[]) {
  await setDoc(doc(db, "notif_read", email), { ids });
}

// ═══════════════════════════════════════════════════════
// CHAT GERAL (single global chat for admin ↔ parceiros)
// Collection: global/chat_geral
// ═══════════════════════════════════════════════════════
export async function getChatGeral(): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "global", "chat_geral"));
  return snap.exists() ? ((snap.data().messages || []) as unknown[]) : [];
}

export async function setChatGeral(messages: unknown[]) {
  await setDoc(doc(db, "global", "chat_geral"), { messages, updatedAt: serverTimestamp() });
}

export function onChatGeralChange(callback: (messages: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "global", "chat_geral"), snap => {
    callback(snap.exists() ? ((snap.data().messages || []) as unknown[]) : []);
  });
}

// ═══════════════════════════════════════════════════════
// PROJECT CHAT (per project key: email-planName)
// Collection: project_chat/{projectKey}
// ═══════════════════════════════════════════════════════
export async function getProjectChat(projectKey: string): Promise<unknown[]> {
  const snap = await getDoc(doc(db, "project_chat", projectKey));
  return snap.exists() ? ((snap.data().messages || []) as unknown[]) : [];
}

export async function setProjectChat(projectKey: string, messages: unknown[]) {
  await setDoc(doc(db, "project_chat", projectKey), { messages, updatedAt: serverTimestamp() });
}

export function onProjectChatChange(projectKey: string, callback: (messages: unknown[]) => void): Unsubscribe {
  return onSnapshot(doc(db, "project_chat", projectKey), snap => {
    callback(snap.exists() ? ((snap.data().messages || []) as unknown[]) : []);
  });
}
