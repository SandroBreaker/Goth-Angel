
import { supabase } from './supabaseClient.ts';

export const trackAccess = async (currentView: string) => {
  try {
    const data = {
      path: currentView,
      referrer: document.referrer || 'direct',
      user_agent: navigator.userAgent,
      browser_language: navigator.language,
      platform: (navigator as any).platform || 'unknown',
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      hardware_concurrency: navigator.hardwareConcurrency || 0,
      device_memory: (navigator as any).deviceMemory || 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      session_id: getSessionId()
    };

    // Alterado para a nova tabela definida pelo usuário
    const { error } = await supabase
      .from('access_logs_goth')
      .insert([data]);

    if (error) console.warn('Telemetry offline:', error.message);
  } catch (err) {
    console.error('Failed to send signal:', err);
  }
};

// Função simples para manter um ID de sessão durante o tempo que a aba estiver aberta
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('gas_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('gas_session_id', sessionId);
  }
  return sessionId;
};
