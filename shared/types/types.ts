// types that are shared between backed and frontend should go here
import type { PettyCashTransaction } from '../../server/src/db/schema/';
import type { UserTransaction, TransactionHistory } from '../../server/src/db/queries/transaction.queries';
import type { AllUsers } from '../../server/src/db/queries/user.queries';

export type Transaction = PettyCashTransaction;
export type UTransaction = UserTransaction;
export type UTransactionHistory = TransactionHistory;
export type User = AllUsers[number];