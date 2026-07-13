const formatWei = (wei, decimals = 18) => {
    try {
      if (!wei) return '0';
      const padded = wei.padStart(decimals + 1, '0');
      const integerPart = padded.slice(0, -decimals) || '0';
      const fractionalPart = padded.slice(-decimals).replace(/0+$/, '');
      
      const formattedInteger = BigInt(integerPart).toLocaleString('en-US');
      
      return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
    } catch {
      return '0';
    }
};

console.log(formatWei('21600000000000000'));
console.log(formatWei('1'));
console.log(formatWei('0'));
console.log(formatWei('1000000000000000000'));
