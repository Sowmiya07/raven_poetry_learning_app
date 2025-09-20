import React, { useState, useEffect } from 'react';
import { Database, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error' | 'setup-needed'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      // Test basic connection
      const { data, error: connectionError } = await supabase.auth.getSession();
      
      if (connectionError) {
        setStatus('error');
        setError('Supabase connection failed. Please check your environment variables.');
        return;
      }

      // Test if poems table exists
      const { data: tableData, error: tableError } = await supabase
        .from('poems')
        .select('count')
        .limit(1);

      if (tableError) {
        if (tableError.message.includes('relation "poems" does not exist')) {
          setStatus('setup-needed');
          setError('Database tables need to be created. Please run the migration.');
        } else {
          setStatus('error');
          setError(`Database error: ${tableError.message}`);
        }
      } else {
        setStatus('connected');
        setError(null);
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to connect to database. Please check your Supabase configuration.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader className="w-4 h-4 animate-spin text-blue-600" />;
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
      case 'setup-needed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return 'Checking database connection...';
      case 'connected':
        return 'Database connected successfully';
      case 'setup-needed':
        return 'Database setup required';
      case 'error':
        return error || 'Database connection failed';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'checking':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'error':
      case 'setup-needed':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (status === 'connected') {
    return null; // Don't show anything when everything is working
  }

  return (
    <div className={`border-b border-opacity-50 px-4 py-3 ${getStatusColor()}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <div>
            <div className="font-medium text-sm">{getStatusMessage()}</div>
            {status === 'setup-needed' && (
              <div className="text-xs mt-1">
                Click "Connect to Supabase" in the top right, then the database will be set up automatically.
              </div>
            )}
            {status === 'error' && error && (
              <div className="text-xs mt-1">{error}</div>
            )}
          </div>
        </div>
        
        {(status === 'error' || status === 'setup-needed') && (
          <button
            onClick={checkDatabaseConnection}
            className="text-xs px-3 py-1 rounded-md bg-white bg-opacity-50 hover:bg-opacity-75 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}