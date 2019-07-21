using System;
using System.Linq;
using System.Management;
using System.Threading.Tasks;
using cpuMonitor.Models;
using System.Collections.Generic;

namespace cpuMonitor
{
    public class Monitor
    {
        public async Task<object> GetCpuUtilization(dynamic input)
        {
            DateTime requestTimestamp = (DateTime)input.requestTimestamp;
            var cpuStats = new List<CpuStat>();

            ManagementObjectSearcher searcher = new ManagementObjectSearcher("select * from Win32_PerfFormattedData_PerfOS_Processor");

            int cpuNumber = 0;
            foreach (ManagementObject obj in searcher.Get())
            {
                cpuStats.Add(new CpuStat
                {
                    Id = cpuNumber,
                    Percentage = Convert.ToInt32(obj.GetPropertyValue("PercentProcessorTime"))
                });
                cpuNumber += 1;
            }

            return new
            {
                cpuStats = cpuStats,
                avgPercentage = cpuStats.Average(x => x.Percentage)
            };
        }
    }
}
