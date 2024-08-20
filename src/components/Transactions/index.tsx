import { useCallback, useState, useEffect } from "react"
import { SetTransactionApprovalParams } from "utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"
import { useCustomFetch } from "hooks/useCustomFetch"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()
  

  const [approvalStates, setApprovalStates] = useState<Record<string, boolean>>({})


  useEffect(() => {
    if (transactions) {
      const initialApprovalStates = transactions.reduce((acc, transaction) => {
        acc[transaction.id] = transaction.approved
        return acc
      }, {} as Record<string, boolean>)
      setApprovalStates(initialApprovalStates)
    }
  }, [transactions])

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })

      setApprovalStates((prevStates) => ({
        ...prevStates,
        [transactionId]: newValue,
      }))
    },
    [fetchWithoutCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
          isChecked={approvalStates[transaction.id]}
        />
      ))}
    </div>
  )
}
