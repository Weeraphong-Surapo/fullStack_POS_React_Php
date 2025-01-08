import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";

const ProfitCost = ({ totalTypeSale }) => {
  const [state, setState] = useState({
    series: [44, 55],
    options: {
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
          },
          formatter: function (value) {
            // Format value as Thai Baht
            const formatter = new Intl.NumberFormat("th-TH", {
              currency: "THB",
            });
            return formatter.format(value) + " บาท"; // Format and return value
          },
        },
      },
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Team A", "Team B"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    // Check if 'topten' is defined and has items
    if (
      totalTypeSale &&
      Array.isArray(totalTypeSale) &&
      totalTypeSale.length > 0
    ) {
      formatData();
    }
  }, [totalTypeSale]);

  const formatData = () => {
    const data = [];
    const arrayType = [];
    totalTypeSale.forEach((element) => {
      data.push(parseInt(element.total_price));
    });

    totalTypeSale.forEach((element) => {
      arrayType.push(element.type == "CASH" ? "เงินสด" : "เงินโอน");
    });

    setState((prevState) => ({
      ...prevState,
      series: data,
      options: {
        ...prevState.options,
        labels: arrayType,
        //     // xaxis: {
        //     //   categories, // Set categories to product names
        //     // },
      },
    }));

    // // Assuming 'topten' is an array of objects like [{ product_name: 'Product A', total_amount: 500 }]
    // const categories = totalTypeSale.map(
    //   (item) => item.name || "Unknown Product"
    // ); // Map product names
    // const data = totalTypeSale.map((item) => item.total_price || 0); // Map total amounts
    // console.log(data);

    // Update state with the new data
  };

  return (
    <div className="d-flex justify-content-center">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="pie"
        width={400}
      />
    </div>
  );
};
export default ProfitCost;
