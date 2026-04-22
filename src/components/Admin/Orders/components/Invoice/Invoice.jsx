import React from "react";

const Invoice = React.forwardRef(({ order }, ref) => {
  return (
    <div ref={ref}>
      <h1>Invoice</h1>
      <p>{order.full_name}</p>
      <p>{order.total_amount}</p>
    </div>
  );
});

export default Invoice;