/** Book-cover palettes; one is picked deterministically from the book name. */
const covers = [
  'from-[#8c2f39] to-[#5a1a22]',
  'from-[#2f5d50] to-[#1c3a31]',
  'from-[#34506e] to-[#1e3248]',
  'from-[#8a5a2b] to-[#5a3716]',
  'from-[#5b3a6b] to-[#38224a]',
]

export const coverFor = (name: string) =>
  covers[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % covers.length]
