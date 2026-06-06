import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

interface FileInfo {
  key: string;
  size: number;
  lastModified: string;
}

interface FilesResponse {
  total: number;
  files: FileInfo[];
}

const API_URL = 'http://localhost:3001/files';

function App() {
  const [limit, setLimit] = useState(3);
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recentFiles, setRecentFiles] = useState<FileInfo[]>([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const loadRecentFiles = async (currentLimit = limit) => {
    try {
      const response = await axios.get<FilesResponse>(
        `${API_URL}/recent?limit=${currentLimit}`,
      );

      setRecentFiles(response.data.files);
      setTotalFiles(response.data.total);
    } catch (error) {
      console.error(error);
      setMessage('No se pudieron cargar los archivos recientes.');
    }
  };

  useEffect(() => {
    loadRecentFiles(limit);
  }, [limit]);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);

    setSelectedFiles(fileArray);
    setMessage(`${fileArray.length} archivo(s) seleccionado(s).`);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.dataTransfer.files.length > 0) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setMessage('Primero selecciona o arrastra uno o más archivos.');
      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });

    try {
      setIsUploading(true);
      setMessage('Subiendo archivo(s)...');

      await axios.post(`${API_URL}/upload`, formData);

      setMessage('Archivo(s) subido(s) correctamente.');
      setSelectedFiles([]);

      await loadRecentFiles(limit);
    } catch (error) {
      console.error(error);
      setMessage('Error al subir los archivos.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFile = (key: string) => {
    window.open(
      `${API_URL}/download/${encodeURIComponent(key)}`,
      '_blank',
    );
  };

  return (
    <main className="container">
      <section className="upload-section">
        <h1>Clon Drive LocalStack</h1>

        <p className="subtitle">
          Carga documentos, imágenes o videos en un bucket S3 local.
        </p>

        <div
          className="dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <p>Arrastra y suelta uno o más archivos aquí</p>
          <span>o</span>

          <input
            type="file"
            multiple
            onChange={(event) => {
              if (event.target.files) {
                handleFiles(event.target.files);
              }
            }}
          />

          {selectedFiles.length > 0 && (
            <div className="selected-files">
              {selectedFiles.map((file) => (
                <p key={`${file.name}-${file.lastModified}`}>
                  {file.name}
                </p>
              ))}
            </div>
          )}
        </div>

        {message && <p className="message">{message}</p>}

        <button onClick={uploadFiles} disabled={isUploading}>
          {isUploading ? 'Subiendo...' : 'Cargar archivo(s)'}
        </button>
      </section>

      <section className="recent-section">
        <h2>
          {limit === 3
            ? 'Últimos 3 archivos'
            : `Últimos ${Math.min(limit, totalFiles)} archivos`}
        </h2>

        {recentFiles.length === 0 ? (
          <p className="empty">
            Todavía no hay archivos cargados.
          </p>
        ) : (
          <>
            {recentFiles.map((file) => (
              <div className="file-card" key={file.key}>
                <div>
                  <strong>{file.key}</strong>
                  <p>{Math.round(file.size / 1024)} KB</p>
                </div>

                <button onClick={() => downloadFile(file.key)}>
                  Descargar
                </button>
              </div>
            ))}

            {recentFiles.length < totalFiles && (
              <button
                className="show-more-button"
                onClick={() => setLimit((prev) => prev + 5)}
              >
                Mostrar más
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default App;