import React, { useState } from 'react'
import Say from 'react-say';

interface Props {
  text: string,
  disabled?: boolean,
  style?: any,
  className?: string,
  children?: React.ReactNode,
};

const SayButton: React.FC<Props> = ({
  text, disabled,
  className, style, children,
}) => {
  const [busy, setBusy] = useState(false);
  return (
    <>
      <button
        className={className}
        style={style}
        disabled={disabled || busy}
        type="button"
        onClick={() => setBusy(true)}
      >
        {children}
      </button>
      {busy && <Say
        speak={text}
        text={text} 
        onEnd={() => setBusy(false)}
      />}
    </>
  );
}

export default SayButton;