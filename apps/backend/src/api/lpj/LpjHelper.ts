import type { RekeningLpj } from "./LpjModel";

const mergeSameObjectById = (data: RekeningLpj[]) => {
  const map = new Map<number, RekeningLpj>();

  for (const item of data) {
    if (map.has(item.id)) {
      const existingData = map.get(item.id);
      if (existingData) {
        existingData.total_anggaran += item.total_anggaran;
        existingData.total_belanja += item.total_belanja;
        existingData.total_akumulasi_belanja += item.total_akumulasi_belanja;
      }
    } else {
      map.set(item.id, { ...item });
    }
  }

  return Array.from(map.values());
};

export { mergeSameObjectById };
