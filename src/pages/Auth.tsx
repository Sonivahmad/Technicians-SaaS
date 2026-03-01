import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, ShieldCheck, Snowflake } from 'lucide-react';

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;

  const sendOtp = async () => {
    if (phone.length < 10) {
      toast.error('Enter a valid mobile number');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setOtpSent(true);
      toast.success('OTP sent! / OTP भेजा गया!');
    }
  };

  const verifyOtp = async () => {
    if (otp.length < 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: fullPhone,
      token: otp,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Login successful! / लॉगिन सफल!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-cool shadow-elevated">
            <Snowflake className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">CoolTech</h1>
          <p className="text-sm text-muted-foreground">AC Service Manager / AC सर्विस मैनेजर</p>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card space-y-4">
          {!otpSent ? (
            <>
              <div>
                <Label className="text-sm font-medium">Mobile Number / मोबाइल नंबर</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <div className="absolute left-9 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">+91</div>
                  <Input
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="pl-16 text-lg tracking-wider"
                    type="tel"
                    maxLength={10}
                  />
                </div>
              </div>
              <Button
                onClick={sendOtp}
                disabled={loading || phone.length < 10}
                className="w-full gradient-primary text-primary-foreground border-0 h-12 text-base"
              >
                {loading ? 'Sending...' : 'Send OTP / OTP भेजें'}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center text-sm text-muted-foreground">
                OTP sent to <span className="font-semibold text-foreground">{fullPhone}</span>
              </div>
              <div>
                <Label className="text-sm font-medium">Enter OTP / OTP डालें</Label>
                <div className="relative mt-1.5">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="pl-9 text-lg tracking-[0.3em] text-center"
                    type="tel"
                    maxLength={6}
                  />
                </div>
              </div>
              <Button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full gradient-success text-success-foreground border-0 h-12 text-base"
              >
                {loading ? 'Verifying...' : 'Verify & Login / लॉगिन करें'}
              </Button>
              <button
                onClick={() => { setOtpSent(false); setOtp(''); }}
                className="w-full text-sm text-muted-foreground hover:text-primary"
              >
                Change number / नंबर बदलें
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
