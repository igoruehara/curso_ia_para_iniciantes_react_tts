import React, { useState, useEffect } from 'react';
import './TextToSpeech.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rate, setRate] = useState(1); // Velocidade da fala
  const [pitch, setPitch] = useState(1); // Tom da fala

  useEffect(() => {
    // Função para carregar as vozes disponíveis
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      let availableVoices = synth.getVoices();

      if (availableVoices.length !== 0) {
        setVoices(availableVoices);
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleSpeak = () => {
    if (text.trim() === '') {
      alert('Por favor, insira algum texto para falar.');
      return;
    }

    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);

    // Selecionar a voz escolhida
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterThis.voice = voice;
    }

    utterThis.rate = rate;
    utterThis.pitch = pitch;

    utterThis.onstart = () => {
      setIsSpeaking(true);
    };

    utterThis.onend = () => {
      setIsSpeaking(false);
    };

    utterThis.onerror = (event) => {
      console.error('Erro na síntese de fala:', event.error);
      setIsSpeaking(false);
    };

    synth.speak(utterThis);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="tts-container">
      <h1>Síntese de Fala (Text-to-Speech)</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite o texto que deseja ouvir..."
        rows="6"
      ></textarea>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="voice-select">Escolha a Voz:</label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
          >
            {voices.map((voice, index) => (
              <option key={index} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="rate">Velocidade: {rate}</label>
          <input
            type="range"
            id="rate"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="pitch">Tom: {pitch}</label>
          <input
            type="range"
            id="pitch"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
          />
        </div>
      </div>

      <div className="buttons">
        {!isSpeaking ? (
          <button onClick={handleSpeak}>Falar</button>
        ) : (
          <button onClick={handleStop}>Parar</button>
        )}
      </div>

      <div className="status">
        {isSpeaking ? <p>Fala em andamento...</p> : <p>Pronto para falar.</p>}
      </div>
    </div>
  );
};

export default TextToSpeech;
