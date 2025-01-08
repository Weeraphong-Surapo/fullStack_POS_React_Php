import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";

const TopProduct = ({ topten }) => {
  const [state, setState] = useState({
    series: [
      {
        data: [], // Start with an empty array for data
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#FF4560", "#00E336"], // Add custom colors for the pie chart segments
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [], // Will be filled with the product names dynamically
      },
    },
  });

  // Update chart data when topten changes
  useEffect(() => {
    // Check if 'topten' is defined and has items
    if (topten && Array.isArray(topten) && topten.length > 0) {
      formatData();
    }
  }, [topten]);

  const formatData = () => {
    // Assuming 'topten' is an array of objects like [{ product_name: 'Product A', total_amount: 500 }]
    const categories = topten.map((item) => item.name || "Unknown Product"); // Map product names
    const data = topten.map((item) => item.total_amount || 0); // Map total amounts

    // Update state with the new data
    setState((prevState) => ({
      ...prevState,
      series: [
        {
          name: "จำนวน",
          data,
        },
      ], // Update series data
      options: {
        ...prevState.options,
        xaxis: {
          categories, // Set categories to product names
        },
      },
    }));
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default TopProduct;
