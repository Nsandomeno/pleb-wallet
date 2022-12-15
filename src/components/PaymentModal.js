import React, { useState } from "react" ;
import Modal from "react-modal" ;
import axios from "axios" ;
import "./PaymentModal.css" ;

const customStyles = {
    content: {
        top: "20%",
        left: "40%",
        right: "40%",
        bottom: "auto",
    },
};

const PaymentsModal = ({ modalState, setModalState }) => {
    const [formData, setFormData] = useState({
        amount: 0,
        invoiceToPay: "",
    });

    const [invoice, setInvoice] = useState("");

    const [paymentInfo, setPaymentInfo] = useState({
        paymentHash: "",
        checkingId: "",
    });
    // Function to clear all of our state when we close the modal
    const clearForms = () => {
        setModalState({
            type: "",
            open: false,
        });
        setInvoice("");
        setPaymentInfo({
            paymentHash: "",
            checkingId: "",
        });
        setFormData({
            amount: 0,
            invoiceToPay: "",
        });
    };
    const handleSend = (e) => {
        // Keep the page from refreshing when the form is submitted
        e.preventDefault ();
        const headers = {
            "X-Api-Key" : "52cac212fc664da393ac45df991fdb84",
        };
        const data = {
            bolt11: formData.invoiceToPay,
            out: true,
        };
        axios
            .post("https://legend.lnbits.com/api/v1/payments", data, { headers })
            .then((res) =>
                setPaymentInfo ({
                    paymentHash: res.data.payment_hash,
                    checkingId: res.data.checking_id,
                })
            )
            .catch((err) => console.log(err));

        return;
        };

        const handleReceive = (e) => {
            // Keep the page from refreshing when the form is submitted
            e.preventDefault();
            const headers = {
                "X-Api-Key": "52cac212fc664da393ac45df991fdb84",
            };
            const data = {
                amount: formData.amount,
                out: false,
                // ToDo: Add additional form for user to be able to customize the memo
                memo: "LNBits",
            };
            axios
                .post("https://legend.lnbits.com/api/v1/payments", data, { headers })
                .then((res) => setInvoice(res.data.payment_request))
                .catch((err) => console.log(err));

            return;
        };

    return (
        <Modal
            isOpen={modalState.open}
            style={customStyles}
            contentLabel="Example Modal"
            appElement={document.getElementById("root")}
        >
            <p
                className="close-button"
                onClick={() => {
                //setModalState({ open: false, type: null });
                    clearForms();
                }}
            >
                X
            </p>
            {/* If it is a send */}
            {modalState.type === "send" && (
                <form>
                    <label>paste an invoice</label>
                    <input
                        type="text"
                        value={formData.invoiceToPay}
                        onChange={(e) =>
                        setFormData({ ...formData, invoiceToPay: e.target.value })
                        }
                    />
                    <button className="button" onClick={(e) => handleSend(e)}>
                        Submit
                    </button>
                </form>
            )}
            {/* If it is a receive */}
            {modalState.type === "receive" && (
                <form>
                    <label>enter amount</label>
                    <input
                        type="number"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => {
                            setFormData({ ...formData, amount: e.target.value })
                        }}
                    />
                    <button className="button" onClick={(e) => handleReceive(e)}>
                        Submit
                    </button>
                </form>
            )}
            {invoice && (
                <section>
                    <h3>Invoice Created</h3>
                    <p>{invoice}</p>
                </section>
            )}
            {paymentInfo.paymentHash && (
                <section>
                    <h3>Payment Sent</h3>
                    <p>Payment hash: {paymentInfo.paymentHash}</p>
                    <p>Checking ID: {paymentInfo.checkingId}</p>
                </section>
            )}
        </Modal>
    );
};
export default PaymentsModal;
