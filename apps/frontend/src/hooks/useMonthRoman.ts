const useMonthRoman = (dateString: string) => {
  const monthRomanMap = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
  };
  const month = new Date(dateString).getMonth() + 1;
  return monthRomanMap[month as keyof typeof monthRomanMap];
};

export { useMonthRoman };
