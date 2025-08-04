import { useDaysRange } from '../context/DaysRangeContext';

const Header = () => {
  const { daysRange, setDaysRange } = useDaysRange();

  return (
    <header className="header">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400">Copilot Stats Dashboard</h1>
        <div className="days-range-selector">
          <label htmlFor="days-range" className="mr-2">Time Period:</label>
          <select
            id="days-range"
            value={daysRange}
            onChange={(e) => setDaysRange(Number(e.target.value))}
            className="bg-gray-800 p-2 rounded-md"
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
