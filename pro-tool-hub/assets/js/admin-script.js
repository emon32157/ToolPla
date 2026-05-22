/**
 * Admin dashboard & interactive charts setup.
 */
jQuery(document).ready(function($) {
    
    // Initialize Dashboard Statistics Charts if analytics endpoints are present
    if ($('#pth-traffic-chart').length > 0 && window.pth_initial_stats) {
        initDailyStatsChart(window.pth_initial_stats.daily);
        initBreakdownChart(window.pth_initial_stats.per_tool);
    }

    function initDailyStatsChart(data) {
        const ctx = document.getElementById('pth-traffic-chart').getContext('2d');
        const labels = data.map(item => item.view_date);
        const values = data.map(item => item.total_views);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Impressions',
                    data: values,
                    borderColor: '#2271b1',
                    backgroundColor: 'rgba(34, 113, 177, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    function initBreakdownChart(data) {
        const ctx = document.getElementById('pth-breakdown-chart').getContext('2d');
        const labels = data.map(item => item.post_title);
        const values = data.map(item => item.total_views);

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#10b981',
                        '#3b82f6',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#ec4899',
                        '#6b7280'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 12 }
                    }
                }
            }
        });
    }

    // Reset statistics action handler
    $('#pth-reset-stats-btn').on('click', function(e) {
        e.preventDefault();
        
        if (confirm(pth_admin_data.strings.confirm_reset)) {
            const btn = $(this);
            btn.prop('disabled', true).text('Clearing statistics...');

            $.post(pth_admin_data.ajax_url, {
                action: 'pro_tool_hub_reset_analytics',
                nonce: pth_admin_data.nonce
            }, function(response) {
                if (response.success) {
                    alert(response.data.message);
                    window.location.reload();
                } else {
                    alert(response.data.message || pth_admin_data.strings.error);
                    btn.prop('disabled', false).text('Wipe Statistics Data');
                }
            }, 'json').fail(function() {
                alert(pth_admin_data.strings.error);
                btn.prop('disabled', false).text('Wipe Statistics Data');
            });
        }
    });
});
