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
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isBudgetModalOpen, setBudgetModalOpen] = useState(false);
  const [isSavingsModalOpen, setSavingsModalOpen] = useState(false);

  const openTransactionModal = () => setTransactionModalOpen(true);
  const closeTransactionModal = () => setTransactionModalOpen(false);
  const openWalletModal = () => setWalletModalOpen(true);
  const closeWalletModal = () => setWalletModalOpen(false);
  const openBudgetModal = () => setBudgetModalOpen(true);
  const closeBudgetModal = () => setBudgetModalOpen(false);
  const openSavingsModal = () => setSavingsModalOpen(true);
  const closeSavingsModal = () => setSavingsModalOpen(false);

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
        closeSavingsModal
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
