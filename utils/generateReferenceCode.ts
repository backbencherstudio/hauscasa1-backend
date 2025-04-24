export const generateReferenceCode = (): string => {
    const prefix = 'REF';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Bias toward letters
    let randomPart = '';
  
    for (let i = 0; i < 8; i++) {
      randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return `${prefix}-${randomPart}`;
  };
  