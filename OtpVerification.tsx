import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface OtpVerificationProps {
  contact: string;
  onVerified: () => void;
  onBack: () => void;
}

const OtpVerification = ({ contact, onVerified, onBack }: OtpVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast({ title: "Enter complete OTP", variant: "destructive" });
      return;
    }
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 1000));
    // Mock: accept any 6-digit code
    if (code === "000000") {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      toast({ title: "Invalid OTP", description: "Please try again.", variant: "destructive" });
      setIsVerifying(false);
      return;
    }
    toast({ title: "OTP Verified!", description: "Welcome!" });
    setIsVerifying(false);
    onVerified();
  };

  const handleResend = () => {
    setTimer(30);
    toast({ title: "OTP Resent", description: `Code sent to ${contact}` });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Verify your identity</h2>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">{contact}</span>
        </p>
      </div>

      <div className={`flex justify-center gap-2 ${shake ? "animate-shake" : ""}`}>
        {otp.map((digit, i) => (
          <Input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value.replace(/\D/, ""))}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-14 text-center text-lg font-semibold bg-card border-border focus:border-primary focus:ring-primary"
          />
        ))}
      </div>

      <Button onClick={handleVerify} disabled={isVerifying} className="w-full h-11">
        {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
      </Button>

      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-muted-foreground">
            Resend in <span className="font-medium text-foreground">{timer}s</span>
          </p>
        ) : (
          <button onClick={handleResend} className="text-sm font-medium text-primary hover:text-primary-hover">
            Resend OTP
          </button>
        )}
      </div>

      <button onClick={onBack} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </button>
    </motion.div>
  );
};

export default OtpVerification;
