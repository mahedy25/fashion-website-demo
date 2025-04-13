'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export default function PasswordForm() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [email, setEmail] = useState('')
  const [resetStep, setResetStep] = useState<'email' | 'code' | null>(null)
  const [code, setCode] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirm, setResetConfirm] = useState('')

  const handlePasswordChange = async () => {
    // TODO: call your backend route to update password (with oldPassword + newPassword)
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    // Replace with actual API call
    toast.success('Password updated successfully')
  }

  const handleSendResetCode = async () => {
    if (!email) return toast.error('Email is required')

    // TODO: Send email with code (backend logic)
    toast.success(`Reset code sent to ${email}`)
    setResetStep('code')
  }

  const handleResetPassword = async () => {
    if (resetPassword !== resetConfirm) {
      toast.error('Passwords do not match')
      return
    }

    // TODO: call backend to verify code and reset password
    toast.success('Password reset successful')
    setResetStep(null)
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <h2 className="font-bold mb-4">Change Password</h2>

        {/* Old Password */}
        <Label>Old Password</Label>
        <div className="relative mb-3">
          <Input
            type={showOld ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowOld(!showOld)}
          >
            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* New Password */}
        <Label>New Password</Label>
        <div className="relative mb-3">
          <Input
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <Label>Confirm Password</Label>
        <div className="relative mb-3">
          <Input
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex gap-4 mt-4">
          <Button onClick={handlePasswordChange}>Update Password</Button>
          <Button variant="ghost" onClick={() => setResetStep('email')}>
            Forgot Password?
          </Button>
        </div>

        {/* Reset Password Modal */}
        {resetStep && (
          <div className="mt-6 border-t pt-4">
            {resetStep === 'email' ? (
              <>
                <Label>Enter your email</Label>
                <Input
                  className="mb-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSendResetCode}>Send Reset Code</Button>
              </>
            ) : (
              <>
                <Label>Verification Code</Label>
                <Input
                  className="mb-3"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <Label>New Password</Label>
                <Input
                  type="password"
                  className="mb-3"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                />

                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  className="mb-3"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                />

                <Button onClick={handleResetPassword}>Reset Password</Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
