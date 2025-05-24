import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSettings } from '../context/SettingsContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Record: React.FC = () => {
  const { settings } = useSettings();

  // Datos del gráfico
  const chartData = {
    labels: settings.sessions.map((session) => session.date),
    datasets: [
      {
        label: 'Pomodoro Sessions',
        data: settings.sessions.map((session) => session.count),
        backgroundColor: '#ba4949', // Color rojo para Pomodoro
        borderColor: '#ba4949',
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pomodoro Sessions History',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white/10 rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-white mb-4">Pomodoro Record</h2>
      <div className="max-w-full h-80">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Record;
