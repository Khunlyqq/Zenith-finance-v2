"use client";

import React, { createContext, useContext, useState } from "react";

export interface ModalContextType {
  isTransactionModalOpen: boolean;
  openTransactionModal: () => void;
  closeTransactionModal: () => void;
  isWalletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
  isBudgetModalOpen: boolean;
  openBudgetModal: () => void;
  closeBudgetModal: () => void;
  isSavingsModalOpen: boolean;
  openSavingsModal: () => void;
  closeSavingsModal: () => void;
  isAddFundModalOpen: boolean;
  openAddFundModal: (goalId: string, goalName: string) => void;
  closeAddFundModal: () => void;
  selectedGoal: { id: string; name: string } | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isBudgetModalOpen, setBudgetModalOpen] = useState(false);
  const [isSavingsModalOpen, setSavingsModalOpen] = useState(false);
  const [isAddFundModalOpen, setAddFundModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<{ id: string; name: string } | null>(null);

  const openTransactionModal = () => setTransactionModalOpen(true);
  const closeTransactionModal = () => setTransactionModalOpen(false);
  const openWalletModal = () => setWalletModalOpen(true);
  const closeWalletModal = () => setWalletModalOpen(false);
  const openBudgetModal = () => setBudgetModalOpen(true);
  const closeBudgetModal = () => setBudgetModalOpen(false);
  const openSavingsModal = () => setSavingsModalOpen(true);
  const closeSavingsModal = () => setSavingsModalOpen(false);

  const openAddFundModal = (goalId: string, goalName: string) => {
    setSelectedGoal({ id: goalId, name: goalName });
    setAddFundModalOpen(true);
  };
  const closeAddFundModal = () => {
    setAddFundModalOpen(false);
    setSelectedGoal(null);
  };

  return (
    <ModalContext.Provider 
      value={{ 
        isTransactionModalOpen, 
        openTransactionModal, 
        closeTransactionModal,
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
        isBudgetModalOpen,
        openBudgetModal,
        closeBudgetModal,
        isSavingsModalOpen,
        openSavingsModal,
        closeSavingsModal,
        isAddFundModalOpen,
        openAddFundModal,
        closeAddFundModal,
        selectedGoal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
