const CardDashboard = ({ data, title, unit }) => {
  const formatThaiNumber = (number) => {
    return new Intl.NumberFormat("th-TH").format(number);
  };

  return (
    <div className="col-lg-3 col-md-4 mb-3">
      <div className="card border-0 shadow">
        <div className="card-body">
          <h2 className="text-center">{title}</h2>
          <h5 className="text-center">
            {formatThaiNumber(data)} {unit}
          </h5>
        </div>
      </div>
    </div>
  );
};
export default CardDashboard;
