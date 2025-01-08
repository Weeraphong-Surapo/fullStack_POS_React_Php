import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from "react";

const ListSale = ({ totalPerDay }) => {
  const [state, setState] = useState({
    series: [
      {
        name: "CASH",
        data: [], // Placeholder for cash sales data
      },
      {
        name: "QR CODE",
        data: [], // Placeholder for QR code sales data
      },
    ],
    options: {
      title: {
        text: "รายงานยอดขายแต่ละวัน",
        align: "left",
      },
      chart: {
        type: "bar",
        height: 350,
        stacked: true, // Stacked bar chart
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          borderRadiusApplication: "end", // 'around', 'end'
          borderRadiusWhenStacked: "last", // 'all', 'last'
          dataLabels: {
            total: {
              enabled: true,
              formatter: function (value) {
                // Format value as Thai Baht
                const formatter = new Intl.NumberFormat("th-TH", {
                  currency: "THB",
                });
                return formatter.format(value); // Format and return value
              },
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      
      xaxis: {
        type: "category", // Change to category for dates
        categories: [], // Categories will be populated based on `totalPerDay`
        labels: {
          style: {
            // colors: [
            //   "#1E90FF",
            //   "#FF4500",
            //   "#32CD32",
            //   "#8A2BE2",
            //   "#FFD700",
            //   "#87CEEB",
            //   "#DC143C",
            //   "#40E0D0",
            //   "#FF7F50",
            //   "#228B22",
            //   "#9400D3",
            //   "#D2691E",
            // ], // สีข้อความแต่ละเดือน
            fontSize: "12px", // ขนาดข้อความ
          },
          formatter: function (val) {
            return `${val}`; // Add prefix "เดือน" to each category
          },
        },
      },

      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  });

  // Update chart data when totalPerDay changes
  useEffect(() => {
    if (totalPerDay && Array.isArray(totalPerDay) && totalPerDay.length > 0) {
      formatData();
    }
  }, [totalPerDay]);

  const formatThaiNumber = (number) => {
    return new Intl.NumberFormat("th-TH").format(number);
  };

  const formatData = () => {
    // Group data by order_date and sum the total_amount for each type (CASH, QR CODE)
    const groupedData = totalPerDay.reduce((acc, item) => {
      const { order_date, total_amount, type } = item;

      // Initialize the date group if it doesn't exist
      if (!acc[order_date]) {
        acc[order_date] = { CASH: 0, "QR CODE": 0 };
      }

      // Add the total_amount to the appropriate type
      acc[order_date][type] += parseFloat(total_amount);
      return acc;
    }, {});

    // Extract the categories (dates) and data for each series
    const categories = Object.keys(groupedData);
    const cashData = categories.map((date) => groupedData[date]["CASH"] || 0);
    const qrcodeData = categories.map(
      (date) => groupedData[date]["QR CODE"] || 0
    );

    // Update state with the new data
    setState((prevState) => ({
      ...prevState,
      series: [
        {
          name: "เงินสด",
          data: cashData,
        },
        {
          name: "เงินโอน",
          data: qrcodeData,
        },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          categories, // Set categories to the order dates
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

export default ListSale;
