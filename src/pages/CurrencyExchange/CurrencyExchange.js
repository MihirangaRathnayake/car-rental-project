import React, { useState, useEffect } from 'react';
import './CurrencyExchange.css';

// Icon component for CDN-based icons
const Icon = ({ type, className = "", style = "material" }) => {
    const materialIconsMap = {
        currency_exchange: "currency_exchange",
        trending_up: "trending_up",
        trending_down: "trending_down",
        trending_flat: "trending_flat",
        attach_money: "attach_money",
        euro_symbol: "euro_symbol",
        currency_pound: "currency_pound",
        currency_yen: "currency_yen",
        currency_bitcoin: "currency_bitcoin",
        analytics: "analytics",
        refresh: "refresh",
        notifications: "notifications",
        schedule: "schedule",
        public: "public",
        show_chart: "show_chart",
        pie_chart: "pie_chart",
        bar_chart: "bar_chart",
        timeline: "timeline",
        compare_arrows: "compare_arrows",
        swap_horiz: "swap_horiz",
        account_balance: "account_balance",
        credit_card: "credit_card",
        payment: "payment",
        savings: "savings",
        monetization_on: "monetization_on",
        local_atm: "local_atm",
        calculate: "calculate",
        history: "history",
        star: "star",
        bookmark: "bookmark",
        favorite: "favorite",
        info: "info",
        warning: "warning",
        error: "error",
        check_circle: "check_circle",
        download: "download",
        upload: "upload",
        sync: "sync",
        update: "update",
        access_time: "access_time",
        speed: "speed"
    };

    return <span className={`material-icons ${className}`}>{materialIconsMap[type]}</span>;
};

const CurrencyExchange = () => {
    const [selectedBaseCurrency, setSelectedBaseCurrency] = useState('USD');
    const [selectedTargetCurrency, setSelectedTargetCurrency] = useState('EUR');
    const [amount, setAmount] = useState(1000);
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [watchlist, setWatchlist] = useState(['EUR', 'GBP', 'JPY', 'CAD', 'AUD']);
    const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

    // Simulated live exchange rates (in real app, this would come from an API)
    const [exchangeRates, setExchangeRates] = useState({
        USD: { rate: 1.0000, change: 0.00, changePercent: 0.00, high: 1.0000, low: 1.0000 },
        EUR: { rate: 0.8456, change: -0.0023, changePercent: -0.27, high: 0.8489, low: 0.8432 },
        GBP: { rate: 0.7234, change: 0.0045, changePercent: 0.63, high: 0.7256, low: 0.7198 },
        JPY: { rate: 149.85, change: 1.23, changePercent: 0.83, high: 150.12, low: 148.67 },
        CAD: { rate: 1.3567, change: -0.0089, changePercent: -0.65, high: 1.3598, low: 1.3534 },
        AUD: { rate: 1.5234, change: 0.0156, changePercent: 1.03, high: 1.5267, low: 1.5189 },
        CHF: { rate: 0.8923, change: 0.0034, changePercent: 0.38, high: 0.8945, low: 0.8901 },
        CNY: { rate: 7.2456, change: -0.0234, changePercent: -0.32, high: 7.2567, low: 7.2389 },
        INR: { rate: 83.2345, change: 0.1234, changePercent: 0.15, high: 83.4567, low: 83.1234 },
        BRL: { rate: 5.1234, change: -0.0567, changePercent: -1.09, high: 5.1567, low: 5.0987 },
        RUB: { rate: 92.3456, change: 2.3456, changePercent: 2.61, high: 93.1234, low: 90.2345 },
        KRW: { rate: 1342.56, change: -5.67, changePercent: -0.42, high: 1348.23, low: 1339.45 }
    });

    // Historical data for charts (simulated)
    const [historicalData, setHistoricalData] = useState({
        '1D': [
            { time: '09:00', rate: 0.8432 },
            { time: '10:00', rate: 0.8445 },
            { time: '11:00', rate: 0.8467 },
            { time: '12:00', rate: 0.8489 },
            { time: '13:00', rate: 0.8478 },
            { time: '14:00', rate: 0.8456 },
            { time: '15:00', rate: 0.8463 },
            { time: '16:00', rate: 0.8456 }
        ],
        '1W': [
            { time: 'Mon', rate: 0.8423 },
            { time: 'Tue', rate: 0.8445 },
            { time: 'Wed', rate: 0.8467 },
            { time: 'Thu', rate: 0.8489 },
            { time: 'Fri', rate: 0.8456 },
            { time: 'Sat', rate: 0.8463 },
            { time: 'Sun', rate: 0.8456 }
        ],
        '1M': [
            { time: 'Week 1', rate: 0.8523 },
            { time: 'Week 2', rate: 0.8445 },
            { time: 'Week 3', rate: 0.8467 },
            { time: 'Week 4', rate: 0.8456 }
        ]
    });

    // Market news and alerts
    const [marketNews, setMarketNews] = useState([
        {
            id: 1,
            title: "EUR/USD Reaches Weekly High",
            content: "The Euro strengthened against the US Dollar following positive economic data from the Eurozone.",
            time: "2 hours ago",
            type: "positive",
            impact: "high"
        },
        {
            id: 2,
            title: "GBP Shows Strong Performance",
            content: "British Pound gains momentum amid improved inflation outlook and Bank of England policy expectations.",
            time: "4 hours ago",
            type: "positive",
            impact: "medium"
        },
        {
            id: 3,
            title: "JPY Volatility Expected",
            content: "Japanese Yen may experience increased volatility due to upcoming Bank of Japan policy meeting.",
            time: "6 hours ago",
            type: "neutral",
            impact: "high"
        },
        {
            id: 4,
            title: "Emerging Markets Update",
            content: "Mixed performance in emerging market currencies as global risk sentiment remains cautious.",
            time: "8 hours ago",
            type: "negative",
            impact: "medium"
        }
    ]);

    // Currency pairs for quick access
    const popularPairs = [
        { base: 'EUR', target: 'USD', name: 'EUR/USD' },
        { base: 'GBP', target: 'USD', name: 'GBP/USD' },
        { base: 'USD', target: 'JPY', name: 'USD/JPY' },
        { base: 'USD', target: 'CAD', name: 'USD/CAD' },
        { base: 'AUD', target: 'USD', name: 'AUD/USD' },
        { base: 'USD', target: 'CHF', name: 'USD/CHF' }
    ];

    // Simulate live data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setExchangeRates(prevRates => {
                const newRates = { ...prevRates };
                Object.keys(newRates).forEach(currency => {
                    if (currency !== 'USD') {
                        const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
                        const newRate = newRates[currency].rate * (1 + variation);
                        const change = newRate - newRates[currency].rate;
                        const changePercent = (change / newRates[currency].rate) * 100;
                        
                        newRates[currency] = {
                            ...newRates[currency],
                            rate: parseFloat(newRate.toFixed(4)),
                            change: parseFloat(change.toFixed(4)),
                            changePercent: parseFloat(changePercent.toFixed(2))
                        };
                    }
                });
                return newRates;
            });
            setLastUpdate(new Date());
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Calculate converted amount
    useEffect(() => {
        if (selectedBaseCurrency === selectedTargetCurrency) {
            setConvertedAmount(amount);
        } else {
            const baseRate = exchangeRates[selectedBaseCurrency]?.rate || 1;
            const targetRate = exchangeRates[selectedTargetCurrency]?.rate || 1;
            const rate = targetRate / baseRate;
            setConvertedAmount(parseFloat((amount * rate).toFixed(2)));
        }
    }, [amount, selectedBaseCurrency, selectedTargetCurrency, exchangeRates]);

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        }).format(amount);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getCurrencyIcon = (currency) => {
        const icons = {
            USD: 'attach_money',
            EUR: 'euro_symbol',
            GBP: 'currency_pound',
            JPY: 'currency_yen',
            BTC: 'currency_bitcoin'
        };
        return icons[currency] || 'monetization_on';
    };

    const handleSwapCurrencies = () => {
        const temp = selectedBaseCurrency;
        setSelectedBaseCurrency(selectedTargetCurrency);
        setSelectedTargetCurrency(temp);
    };

    const addToWatchlist = (currency) => {
        if (!watchlist.includes(currency)) {
            setWatchlist([...watchlist, currency]);
        }
    };

    const removeFromWatchlist = (currency) => {
        setWatchlist(watchlist.filter(c => c !== currency));
    };

    const refreshRates = () => {
        setLoading(true);
        setTimeout(() => {
            setLastUpdate(new Date());
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="currency-exchange-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1 className="page-title">
                        <Icon type="currency_exchange" />
                        Currency Exchange
                    </h1>
                    <p className="page-subtitle">Live market rates and currency conversion</p>
                    <div className="last-update">
                        <Icon type="access_time" />
                        Last updated: {formatTime(lastUpdate)}
                    </div>
                </div>
                <div className="header-actions">
                    <button 
                        className={`btn btn-secondary ${loading ? 'loading' : ''}`}
                        onClick={refreshRates}
                        disabled={loading}
                    >
                        <Icon type="refresh" />
                        {loading ? 'Updating...' : 'Refresh Rates'}
                    </button>
                    <button className="btn btn-primary">
                        <Icon type="notifications" />
                        Set Alerts
                    </button>
                </div>
            </div>

            {/* Currency Converter */}
            <div className="converter-section">
                <div className="converter-card">
                    <div className="converter-header">
                        <h3>
                            <Icon type="calculate" />
                            Currency Converter
                        </h3>
                        <div className="live-indicator">
                            <span className="live-dot"></span>
                            Live Rates
                        </div>
                    </div>
                    
                    <div className="converter-body">
                        <div className="currency-input">
                            <label>From</label>
                            <div className="input-group">
                                <select 
                                    value={selectedBaseCurrency}
                                    onChange={(e) => setSelectedBaseCurrency(e.target.value)}
                                    className="currency-select"
                                >
                                    {Object.keys(exchangeRates).map(currency => (
                                        <option key={currency} value={currency}>{currency}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                    className="amount-input"
                                    placeholder="Enter amount"
                                />
                            </div>
                        </div>

                        <div className="swap-button-container">
                            <button className="swap-button" onClick={handleSwapCurrencies}>
                                <Icon type="swap_horiz" />
                            </button>
                        </div>

                        <div className="currency-input">
                            <label>To</label>
                            <div className="input-group">
                                <select 
                                    value={selectedTargetCurrency}
                                    onChange={(e) => setSelectedTargetCurrency(e.target.value)}
                                    className="currency-select"
                                >
                                    {Object.keys(exchangeRates).map(currency => (
                                        <option key={currency} value={currency}>{currency}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={convertedAmount.toLocaleString()}
                                    readOnly
                                    className="amount-input result"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="conversion-rate">
                        <div className="rate-display">
                            <span className="rate-label">1 {selectedBaseCurrency} = </span>
                            <span className="rate-value">
                                {selectedBaseCurrency === selectedTargetCurrency 
                                    ? '1.0000' 
                                    : (exchangeRates[selectedTargetCurrency]?.rate / exchangeRates[selectedBaseCurrency]?.rate).toFixed(4)
                                } {selectedTargetCurrency}
                            </span>
                        </div>
                        <div className="rate-change">
                            {selectedBaseCurrency !== selectedTargetCurrency && (
                                <span className={`change ${exchangeRates[selectedTargetCurrency]?.changePercent >= 0 ? 'positive' : 'negative'}`}>
                                    <Icon type={exchangeRates[selectedTargetCurrency]?.changePercent >= 0 ? 'trending_up' : 'trending_down'} />
                                    {Math.abs(exchangeRates[selectedTargetCurrency]?.changePercent || 0).toFixed(2)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Currency Pairs */}
            <div className="popular-pairs-section">
                <div className="section-header">
                    <h3>
                        <Icon type="show_chart" />
                        Popular Currency Pairs
                    </h3>
                </div>
                <div className="pairs-grid">
                    {popularPairs.map((pair, index) => {
                        const rate = exchangeRates[pair.target]?.rate / exchangeRates[pair.base]?.rate;
                        const change = exchangeRates[pair.target]?.changePercent || 0;
                        return (
                            <div key={index} className="pair-card">
                                <div className="pair-header">
                                    <div className="pair-name">{pair.name}</div>
                                    <button 
                                        className="star-button"
                                        onClick={() => addToWatchlist(pair.target)}
                                    >
                                        <Icon type="star" />
                                    </button>
                                </div>
                                <div className="pair-rate">{rate.toFixed(4)}</div>
                                <div className={`pair-change ${change >= 0 ? 'positive' : 'negative'}`}>
                                    <Icon type={change >= 0 ? 'trending_up' : 'trending_down'} />
                                    {Math.abs(change).toFixed(2)}%
                                </div>
                                <div className="pair-chart">
                                    <div className="mini-chart">
                                        {historicalData['1D'].map((point, i) => (
                                            <div 
                                                key={i} 
                                                className="chart-bar"
                                                style={{ height: `${(point.rate / 0.85) * 100}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Dashboard */}
            <div className="dashboard-grid">
                {/* Live Rates Table */}
                <div className="rates-table-section">
                    <div className="section-header">
                        <h3>
                            <Icon type="timeline" />
                            Live Exchange Rates
                        </h3>
                        <div className="table-controls">
                            <button className="btn btn-sm btn-secondary">
                                <Icon type="download" />
                                Export
                            </button>
                        </div>
                    </div>
                    <div className="rates-table-container">
                        <table className="rates-table">
                            <thead>
                                <tr>
                                    <th>Currency</th>
                                    <th>Rate (USD)</th>
                                    <th>Change</th>
                                    <th>Change %</th>
                                    <th>High</th>
                                    <th>Low</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(exchangeRates).map(([currency, data]) => (
                                    <tr key={currency} className={currency === 'USD' ? 'base-currency' : ''}>
                                        <td>
                                            <div className="currency-cell">
                                                <Icon type={getCurrencyIcon(currency)} />
                                                <span className="currency-code">{currency}</span>
                                            </div>
                                        </td>
                                        <td className="rate-cell">{data.rate.toFixed(4)}</td>
                                        <td className={`change-cell ${data.change >= 0 ? 'positive' : 'negative'}`}>
                                            {data.change >= 0 ? '+' : ''}{data.change.toFixed(4)}
                                        </td>
                                        <td className={`change-percent-cell ${data.changePercent >= 0 ? 'positive' : 'negative'}`}>
                                            <Icon type={data.changePercent >= 0 ? 'trending_up' : 'trending_down'} />
                                            {Math.abs(data.changePercent).toFixed(2)}%
                                        </td>
                                        <td className="high-cell">{data.high.toFixed(4)}</td>
                                        <td className="low-cell">{data.low.toFixed(4)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn btn-xs btn-primary"
                                                    onClick={() => addToWatchlist(currency)}
                                                >
                                                    <Icon type="bookmark" />
                                                </button>
                                                <button className="btn btn-xs btn-secondary">
                                                    <Icon type="show_chart" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="chart-section">
                    <div className="section-header">
                        <h3>
                            <Icon type="analytics" />
                            {selectedBaseCurrency}/{selectedTargetCurrency} Chart
                        </h3>
                        <div className="timeframe-selector">
                            {['1D', '1W', '1M'].map(timeframe => (
                                <button
                                    key={timeframe}
                                    className={`timeframe-btn ${selectedTimeframe === timeframe ? 'active' : ''}`}
                                    onClick={() => setSelectedTimeframe(timeframe)}
                                >
                                    {timeframe}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="chart-container">
                        <div className="price-chart">
                            {historicalData[selectedTimeframe].map((point, index) => (
                                <div key={index} className="chart-point">
                                    <div 
                                        className="chart-line"
                                        style={{ height: `${(point.rate / 0.85) * 100}%` }}
                                    ></div>
                                    <span className="chart-label">{point.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Watchlist and News */}
            <div className="bottom-section">
                {/* Watchlist */}
                <div className="watchlist-section">
                    <div className="section-header">
                        <h3>
                            <Icon type="favorite" />
                            My Watchlist
                        </h3>
                        <button className="btn btn-sm btn-primary">
                            <Icon type="bookmark" />
                            Add Currency
                        </button>
                    </div>
                    <div className="watchlist-grid">
                        {watchlist.map(currency => (
                            <div key={currency} className="watchlist-card">
                                <div className="watchlist-header">
                                    <div className="currency-info">
                                        <Icon type={getCurrencyIcon(currency)} />
                                        <span className="currency-name">{currency}</span>
                                    </div>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeFromWatchlist(currency)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="watchlist-rate">
                                    {exchangeRates[currency]?.rate.toFixed(4)}
                                </div>
                                <div className={`watchlist-change ${exchangeRates[currency]?.changePercent >= 0 ? 'positive' : 'negative'}`}>
                                    <Icon type={exchangeRates[currency]?.changePercent >= 0 ? 'trending_up' : 'trending_down'} />
                                    {Math.abs(exchangeRates[currency]?.changePercent || 0).toFixed(2)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Market News */}
                <div className="news-section">
                    <div className="section-header">
                        <h3>
                            <Icon type="public" />
                            Market News & Analysis
                        </h3>
                        <button className="btn btn-sm btn-secondary">
                            <Icon type="refresh" />
                            Refresh News
                        </button>
                    </div>
                    <div className="news-list">
                        {marketNews.map(news => (
                            <div key={news.id} className={`news-item ${news.type}`}>
                                <div className="news-header">
                                    <div className="news-title">{news.title}</div>
                                    <div className="news-time">
                                        <Icon type="schedule" />
                                        {news.time}
                                    </div>
                                </div>
                                <div className="news-content">{news.content}</div>
                                <div className="news-footer">
                                    <span className={`impact-badge impact-${news.impact}`}>
                                        {news.impact.toUpperCase()} IMPACT
                                    </span>
                                    <div className="news-actions">
                                        <button className="btn btn-xs btn-secondary">
                                            <Icon type="info" />
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyExchange;