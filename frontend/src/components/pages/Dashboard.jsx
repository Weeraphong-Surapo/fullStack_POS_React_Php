import { useEffect, useState } from "react";
import { getAllReport } from "../functions/report";
import ListSale from "../layouts/ListSale";
import ProfitCost from "../layouts/ProfitCost";
import TopProduct from "../layouts/TopProduct";
import CardDashboard from "../layouts/CardDashboard";
import Spinner from "../layouts/Spinner";
import { Select, Space } from "antd";

const months = [
  "ทั้งหมด",
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const Dashboard = () => {
  const [defaultYear, setDefaultYear] = useState("");
  const [defaultMonth, setDefaultMonth] = useState("ทั้งหมด");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadData = (value) => {
    setLoading(true);
    console.log(value);

    const formData = new FormData();
    formData.append("year", value.year);
    formData.append("month", value.month);
    getAllReport(formData)
      .then((res) => {
        setData(res.data.data);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChangeYear = (year) => {
    setDefaultYear(year);
    loadData({ year, month: defaultMonth });
  };

  const handleChangeMonth = (month) => {
    setDefaultMonth(month);
    loadData({ year: defaultYear, month });
  };
  useEffect(() => {
    loadData({ year: defaultYear, month: defaultMonth });
  }, []);
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center pb-2">
            <h3>Dashboard</h3>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <Select

                className="w-100"
                value={{
                  value: defaultMonth,
                  label: months[defaultMonth - 1],
                }}
                placeholder="เลือกดูเดือน"

                disabled={loading}
                onChange={handleChangeMonth}
                options={months.map((month, index) => ({
                  value: month == "ทั้งหมด" ? "" : index ,
                  label: month,
                }))}
              />
            </div>
            <div className="col-md-6">
              <Select
                className="w-100"
                disabled={loading}
                placeholder="เลือกดูปี"
                value={defaultYear}
                onChange={handleChangeYear}
                options={[
                  { value: "", label: "ทั้งหมด" },
                  { value: 2025, label: "2025" },
                  { value: 2026, label: "2026" },
                  { value: 2027, label: "2027" },
                  { value: 2028, label: "2028" },
                  { value: 2029, label: "2029" },
                  { value: 2030, label: "2030" },
                ]}
              />
            </div>
          </div>
          <div className="row">
            <CardDashboard
              data={data.listCard?.total_cost}
              title="รวมต้นทุน"
              unit="บาท"
            />
            <CardDashboard
              data={data.listCard?.total_price}
              title="ยอดขายรวม"
              unit="บาท"
            />
            <CardDashboard
              data={data.listCard?.total_price - data.listCard?.total_cost}
              title="กำไร"
              unit="บาท"
            />
            {/* <CardDashboard
          data={data.listCard?.total_products}
          title="จำนวนสินค้า"
        /> */}
            <CardDashboard
              data={data.listCard?.total_orders}
              title="รายการขาย"
              unit="รายการ"
            />
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-6 pt-4">
              <TopProduct topten={data.topten} />
            </div>
            <div className="col-md-12 col-lg-6 pt-4">
              <ProfitCost totalTypeSale={data.totalTypeSale} />
            </div>
            <div className="col-md-12 pt-4">
              <ListSale totalPerDay={data.totalPerDay} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;
