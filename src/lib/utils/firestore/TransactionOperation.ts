import { Transaction } from "firebase/firestore";

interface TransactionOperation<T> {
  (transaction: Transaction): Promise<T>;
}

export default TransactionOperation;
