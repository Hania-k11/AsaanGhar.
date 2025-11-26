import { useState, useRef } from 'react';
import axios from 'axios';

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      console.log('🎤 Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('No recording in progress'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          // Create audio blob from chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          console.log('🎤 Recording stopped. Sending to Whisper API...');
          
          // Send to backend for transcription
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          const response = await axios.post('/api/whisper/transcribe', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('✅ Transcription received:', response.data.text);
          if (response.data.wasTranslated) {
            console.log('📝 Original (Urdu):', response.data.originalText);
            console.log('🔄 Translated to English:', response.data.text);
          }
          
          setIsProcessing(false);
          
          // Stop all tracks to release microphone
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          
          resolve(response.data.text);
        } catch (error) {
          console.error('❌ Transcription error:', error);
          console.error('Error response:', error.response?.data);
          console.error('Error status:', error.response?.status);
          console.error('Error message:', error.message);
          setIsProcessing(false);
          
          // Stop all tracks even on error
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }
          
          reject(error);
        }
      };

      // Stop the recording
      mediaRecorderRef.current.stop();
    });
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsProcessing(false);
      audioChunksRef.current = [];
      console.log('🎤 Recording cancelled');
    }
  };

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};
