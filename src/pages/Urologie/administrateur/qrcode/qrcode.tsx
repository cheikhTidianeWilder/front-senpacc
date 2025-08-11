import React, { useState, useEffect } from 'react';

// Types pour TypeScript
interface QRCode {
  id: number;
  qrcodeContenu: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  type: 'success' | 'error' | 'warning';
  text: string;
}

const QRCodeGenerator = () => {
  const [nombreQRCodes, setNombreQRCodes] = useState<number>(40);
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [showImages, setShowImages] = useState<boolean>(false);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [loadingImages, setLoadingImages] = useState<boolean>(false);

  useEffect(() => {
    chargerQRCodes();
  }, []);

  const chargerQRCodes = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/urologie/qrcodes/liste', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setQrCodes(data.qrCodes || []);
        console.log('QR codes chargés:', data.qrCodes?.length);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const genererQRCodes = async (): Promise<void> => {
    setLoading(true);
    setMessage(null);
    setShowImages(false); // Reset l'affichage des images
    setQrImages({}); // Reset les images

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/urologie/qrcodes/generer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nombreQRCodes })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setQrCodes(data.qrCodes || []);
        setMessage({
          type: 'success',
          text: data.message
        });
        console.log('QR codes générés:', data.qrCodes?.length);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Erreur lors de la génération'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erreur de connexion'
      });
    } finally {
      setLoading(false);
    }
  };

  const genererImageQR = async (qrcodeContenu: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/urologie/qrcodes/generer${encodeURIComponent(qrcodeContenu)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.qrCodeImage) {
          setQrImages(prev => ({
            ...prev,
            [qrcodeContenu]: data.qrCodeImage
          }));
          console.log('Image QR générée pour:', qrcodeContenu);
          return true;
        }
      } else {
        console.error('Erreur génération image:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erreur image pour', qrcodeContenu, ':', error);
    }
    return false;
  };

  const chargerToutesLesImages = async (): Promise<void> => {
    if (loadingImages) return;
    
    setLoadingImages(true);
    setShowImages(true);
    
    const codes = qrCodes.slice(0, 30).filter((qr): qr is QRCode => Boolean(qr && qr.qrcodeContenu));
    
    console.log('Chargement de', codes.length, 'images QR...');
    
    // Charger les images par groupes de 3 pour éviter la surcharge
    const batchSize = 3;
    for (let i = 0; i < codes.length; i += batchSize) {
      const batch = codes.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (qr) => {
          if (!qrImages[qr.qrcodeContenu]) {
            await genererImageQR(qr.qrcodeContenu);
          }
        })
      );
      
      // Pause de 500ms entre chaque batch
      if (i + batchSize < codes.length) {
        await new Promise<void>(resolve => setTimeout(resolve, 500));
      }
    }
    
    setLoadingImages(false);
    console.log('Toutes les images sont chargées');
  };

  const imprimerQRCodes = (): void => {
    // S'assurer que toutes les images sont chargées avant d'imprimer
    const imagesChargees = Object.keys(qrImages).length;
    const qrCodesAffiches = Math.min(qrCodes.length, 30);
    
    if (imagesChargees < qrCodesAffiches) {
      alert(`Veuillez attendre que toutes les images soient chargées (${imagesChargees}/${qrCodesAffiches})`);
      return;
    }
    
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Générateur QR Code
            </h1>
            
            {showImages && (
              <button
                onClick={imprimerQRCodes}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                disabled={loadingImages}
              >
                {loadingImages ? 'Chargement...' : 'Imprimer'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Nombre de QR codes :
              </label>
              <input
                type="number"
                value={nombreQRCodes}
                onChange={(e) => setNombreQRCodes(parseInt(e.target.value) || 1)}
                min="1"
                max="500"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={genererQRCodes}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Génération...' : 'Générer QR Codes'}
            </button>

            {qrCodes.length > 0 && (
              <button
                onClick={chargerToutesLesImages}
                disabled={showImages || loadingImages}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loadingImages ? 'Chargement images...' : showImages ? 'Images chargées' : 'Afficher QR Codes'}
              </button>
            )}
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">QR Codes Total</p>
              <p className="text-2xl font-bold text-indigo-900">{qrCodes.length}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Images Générées</p>
              <p className="text-2xl font-bold text-green-900">{Object.keys(qrImages).length}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Dernière Génération</p>
              <p className="text-lg font-bold text-yellow-900">
                {qrCodes.length > 0 && qrCodes[0] && qrCodes[0].createdAt 
                  ? new Date(qrCodes[0].createdAt).toLocaleDateString('fr-FR')
                  : 'Aucune'
                }
              </p>
            </div>
          </div>
        </div>

        {showImages && (
          <div className="bg-white p-6 rounded-lg shadow-lg print-container">
            <div className="flex items-center justify-between mb-4 no-print">
              <h2 className="text-xl font-bold text-gray-800">
                QR Codes ({Math.min(qrCodes.length, 30)})
              </h2>
              <div className="text-sm text-gray-600">
                Images chargées: {Object.keys(qrImages).length}/{Math.min(qrCodes.length, 30)}
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 print-grid">
              {qrCodes.slice(0, 30).map((qr, index) => (
                <div 
                  key={qr && qr.id ? qr.id : `qr-${index}`} 
                  className="bg-gray-50 border border-gray-300 p-2 text-center print-item"
                >
                  {qr && qr.qrcodeContenu && qrImages[qr.qrcodeContenu] ? (
                    <>
                      <img 
                        src={qrImages[qr.qrcodeContenu]} 
                        alt={`QR Code ${qr.qrcodeContenu}`}
                        className="w-full h-20 object-contain mx-auto mb-1"
                        onLoad={() => console.log('Image chargée:', qr.qrcodeContenu)}
                        onError={(e) => {
                          console.error('Erreur chargement image:', qr.qrcodeContenu);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <p className="text-xs font-mono text-gray-700 break-all leading-tight">
                        {qr.qrcodeContenu}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-full h-20 bg-gray-200 flex items-center justify-center mb-1">
                        {qr && qr.qrcodeContenu ? (
                          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <span className="text-xs text-red-500">Pas de contenu</span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-gray-700 break-all leading-tight">
                        {qr && qr.qrcodeContenu ? qr.qrcodeContenu : 'Contenu manquant'}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {qrCodes.length > 30 && (
              <div className="mt-4 text-center no-print">
                <p className="text-gray-500 text-sm">
                  Affichage: 30 premiers QR codes sur {qrCodes.length} total
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          @page {
            margin: 0.8cm;
            size: A4;
          }
          
          * {
            visibility: hidden;
          }
          
          .print-container {
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .print-container * {
            visibility: visible !important;
          }
          
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }
          
          .print-grid {
            display: grid !important;
            grid-template-columns: repeat(5, 1fr) !important;
            grid-template-rows: repeat(3, 1fr) !important;
            gap: 15px !important;
            width: 100% !important;
            height: 100% !important;
            padding: 20px !important;
            box-sizing: border-box !important;
          }
          
          .print-item {
            visibility: visible !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            border: 1px solid #ddd !important;
            background: white !important;
            padding: 15px !important;
            text-align: center !important;
            page-break-inside: avoid !important;
            box-sizing: border-box !important;
          }
          
          .print-item img {
            visibility: visible !important;
            display: block !important;
            width: 100% !important;
            max-width: 120px !important;
            height: auto !important;
            max-height: 120px !important;
            object-fit: contain !important;
            margin: 0 auto 10px auto !important;
          }
          
          .print-item p {
            visibility: visible !important;
            display: block !important;
            font-size: 14px !important;
            font-weight: 600 !important;
            margin: 0 !important;
            color: #333 !important;
            text-align: center !important;
            line-height: 1.2 !important;
          }
          
          /* Masquer tout le reste */
          .min-h-screen > div:first-child > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default QRCodeGenerator;