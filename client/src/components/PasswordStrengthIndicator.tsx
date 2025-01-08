interface Props {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<Props> = ({ password }) => {
  const calculateStrength = (): { score: number; message: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = {
      0: { message: 'Very Weak', color: 'bg-red-500' },
      1: { message: 'Weak', color: 'bg-orange-500' },
      2: { message: 'Fair', color: 'bg-yellow-500' },
      3: { message: 'Good', color: 'bg-blue-500' },
      4: { message: 'Strong', color: 'bg-green-500' },
      5: { message: 'Very Strong', color: 'bg-green-700' }
    };

    return { score, ...strengthMap[score as keyof typeof strengthMap] };
  };

  const strength = calculateStrength();
  const width = `${(strength.score / 5) * 100}%`;

  return (
    <div className="mt-1">
      <div className="h-1 w-full bg-gray-200 rounded-full">
        <div
          className={`h-1 ${strength.color} rounded-full transition-all duration-300`}
          style={{ width }}
        />
      </div>
      <p className={`text-xs mt-1 ${strength.color.replace('bg-', 'text-')}`}>
        {strength.message}
      </p>
    </div>
  );
}; 