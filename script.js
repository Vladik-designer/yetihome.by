document.addEventListener('DOMContentLoaded', () => {
    // Форма и цена
    const form = document.getElementById('booking-form');
    const priceDiv = document.getElementById('price');
    const saunaCheckbox = document.getElementById('sauna');

    const prices = {
        "2": { "weekday": 400, "weekend": 450, "saturday": 650 },
        "4": { "weekday": 500, "weekend": 550, "saturday": 650 },
        "6": { "weekday": 600, "weekend": 650, "saturday": 750 },
        "8": { "weekday": 700, "weekend": 750, "saturday": 850 },
    };

    form.addEventListener('change', () => {
        const guests = document.getElementById('guests').value;
        const sauna = saunaCheckbox.checked ? 90 : 0;

        const dayOfWeek = new Date().getDay(); // 0 - Вс, 1 - Пн, ..., 6 - Сб
        let dayType = 'weekday';
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            dayType = dayOfWeek === 6 ? 'saturday' : 'weekend';
        }

        const totalPrice = prices[guests][dayType] + sauna;
        priceDiv.textContent = `Стоимость: ${totalPrice} BYN`;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        alert('Ваше бронирование отправлено!');
    });

    // Календарь
    function generateCalendar(month, year, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const table = document.createElement('table');
        const header = document.createElement('tr');

        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            header.appendChild(th);
        });

        table.appendChild(header);

        let row = document.createElement('tr');
        for (let i = 0; i < (firstDay.getDay() || 7) - 1; i++) {
            const td = document.createElement('td');
            row.appendChild(td);
        }

        for (let date = 1; date <= daysInMonth; date++) {
            const td = document.createElement('td');
            td.textContent = date;
            row.appendChild(td);

            if ((firstDay.getDay() + date - 1) % 7 === 0) {
                table.appendChild(row);
                row = document.createElement('tr');
            }
        }

        if (row.children.length > 0) {
            table.appendChild(row);
        }

        container.appendChild(table);
    }

    const now = new Date();
    generateCalendar(now.getMonth(), now.getFullYear(), 'month1');
    const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
    const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
    generateCalendar(nextMonth, nextYear, 'month2');

    // Telegram интеграция
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const guests = document.getElementById('guests').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const sauna = saunaCheckbox.checked;

        const message = `
            Заявка на бронирование:
            Количество гостей: ${guests}
            Даты: ${startDate} - ${endDate}
            Сауна: ${sauna ? 'Да' : 'Нет'}
        `.trim();

        try {
            const response = await fetch('https://api.telegram.org/bot<ВАШ_ТОКЕН>/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: '<ВАШ_CHAT_ID>',
                    text: message
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка отправки сообщения.');
            }
            alert('Заявка отправлена!');
        } catch (error) {
            console.error(error);
            alert('Не удалось отправить заявку. Проверьте подключение или повторите позже.');
        }
    });
});
