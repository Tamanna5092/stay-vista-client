import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import "../Form/CheckoutForm.css";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { ImSpinner9 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CheckoutForm = ( {bookingInfo, closeModal, refetch} ) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth()
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState()
  const [cardError, setCardError] = useState("")
  const [processing, setProcessing] = useState(false)
  const navigate = useNavigate()

  useEffect(()=> {
    if(bookingInfo?.price && bookingInfo?.price > 1){
      getClientSectet({price: bookingInfo.price})
    }
  }, [bookingInfo?.price])

  const getClientSectet = async (price) => {
    const { data } = await axiosSecure.post('/create-payment-intent', price )
    console.log("clientSecret", data)
    setClientSecret(data.clientSecret)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true)

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("[error]", error);
      setCardError(error.message)
      return
    } else {
      console.log("[PaymentMethod]", paymentMethod);
      setCardError("")
    }
    // confirm payment
    const { paymentIntent, error: confirmError } = 
    await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: user?.displayName,
          email: user?.email
        }
      }
    })

    if(confirmError){
      console.log("confirmError", confirmError)
      setCardError(confirmError.message)
      processing(false)
      return
    }

    if(paymentIntent.status === "succeeded"){
      console.log("paymentIntent", paymentIntent)
      const paymentInfo = {
        ...bookingInfo,
        roomId: bookingInfo._id,
        transjactionId: paymentIntent.id,
        date: new Date()
      }
      delete paymentInfo._id
      console.log("paymentInfo", paymentInfo)
      try {
        const {data} = await axiosSecure.post('/booking', paymentInfo)
        console.log("after payment booking", data)

        await axiosSecure.patch(`/room/status/${bookingInfo?._id}`,
          {status: true})
        // update ui
        refetch()
        closeModal()
        toast.success("Room booked successful!")
        navigate('/dashboard/my-bookings')
      } catch (error) {
        console.log(error)
      }
  };


  setProcessing(false)

}


  return (
    <>
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <div className="flex mt-2 justify-around">
        <button
          type="submit" disabled={!stripe || !clientSecret || processing}
          className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
        >
          {
            processing? (<ImSpinner9 className="animate-spin m-auto" size={24} />): `Pay $${bookingInfo?.price}`
          }
        </button>
        <button
          onClick={closeModal}
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Cancle
        </button>
      </div>
    </form>
    {cardError && <p className="text-red-600">{cardError}</p>}
    </>
  );
};

CheckoutForm.propTypes = {
  bookingInfo: PropTypes.object,
  closeModal: PropTypes.func,
  refetch: PropTypes.func,
};

export default CheckoutForm;
