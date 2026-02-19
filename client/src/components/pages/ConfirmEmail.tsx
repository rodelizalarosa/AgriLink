import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabase-client';
import { Mail, ArrowRight } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get('email') || '';

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ------------------------------
  // Polling: check if email is verified
  // ------------------------------
  useEffect(() => {
    if (!email) return;

    const checkVerified = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }

        // If email is verified, navigate to login
        if (user?.email === email && user?.email_confirmed_at) {
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error checking verification:', err);
      }
    };

    // Poll every 5 seconds
    const interval = setInterval(checkVerified, 5000);

    return () => clearInterval(interval); // clean up on unmount
  }, [email, navigate]);

  // ------------------------------
  // Resend confirmation email
  // ------------------------------
  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setMessage('Failed to resend email. Please try again.');
      } else {
        setMessage('Confirmation email resent! Check your inbox.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FBE7] via-white to-[#E8F5E9] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-100">
        <div className="flex items-center justify-center mb-8">
          <Mail className="w-12 h-12 text-[#4CAF50]" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 text-center">Check Your Email</h2>
        <p className="text-gray-600 text-center mb-6">
          A confirmation email has been sent to <span className="font-bold">{email}</span>.
          <br />
          Please click the link in the email to verify your account.
        </p>

        {message && (
          <p className="text-center text-sm font-semibold text-[#4CAF50] mb-4">
            {message}
          </p>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-[#4CAF50] hover:bg-[#45A049] text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? <span>Resending...</span> : <span>Resend Email</span>}
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-lg shadow-inner transition-all"
          >
            Back to Login
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-6 text-center">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
};
