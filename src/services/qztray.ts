import qz from 'qz-tray';

// Configurações obrigatórias para funcionar com o Vite/React moderno
qz.api.setPromiseType((resolver: any) => new Promise(resolver));
qz.api.setSha256Type((data: string) => {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(data))
    .then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));
});

let connectionPromise: Promise<void> | null = null;

export async function connectQZ(): Promise<void> {
  if (qz.websocket.isActive()) return;
  
  if (!connectionPromise) {
    connectionPromise = qz.websocket.connect()
      .then(() => { connectionPromise = null; })
      .catch((err: any) => { 
        connectionPromise = null; 
        throw err; 
      });
  }
  
  await connectionPromise;
}

export async function disconnectQZ(): Promise<void> {
  if (qz.websocket.isActive()) {
    await qz.websocket.disconnect();
  }
}

export async function listPrinters(): Promise<string[]> {
  await connectQZ();
  const printers = await qz.printers.find();
  return Array.isArray(printers) ? printers : [printers];
}

export async function printRaw(printerName: string, tspl: string): Promise<void> {
  await connectQZ();
  const config = qz.configs.create(printerName, { raw: true });
  const data = [{ type: 'raw', format: 'plain', data: tspl }];
  await qz.print(config, data);
}
