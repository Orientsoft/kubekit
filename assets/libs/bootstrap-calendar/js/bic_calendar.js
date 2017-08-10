/*
 *  Bic Calendar - v3.1.2
 *  A simple twitter bootstrap calendar / agenda to mark events and select range of dates.
 *  http://bichotll.github.io/bic_calendar
 *
 *  Made by bichotll
 *  Under Apache License
 */
$.fn.bic_calendar = function(options) {

    var opts = $.extend({}, $.fn.bic_calendar.defaults, options);



    this.each(function() {


        /*** vars ***/


        //element called
        var elem = $(this);

        var calendar;
        var daysMonthLayer;
        var textMonthCurrentLayer = $('<div class="visualmonth"></div>');
        var textYearCurrentLayer = $('<div class="visualyear"></div>');

        var calendarId = "bic_calendar";

        var events = opts.events;

        var dayNames;
        if (typeof opts.dayNames != "undefined")
            dayNames = opts.dayNames;
        else
            dayNames = ["l", "m", "x", "j", "v", "s", "d"];

        var monthNames;
        if (typeof opts.monthNames != "undefined")
            monthNames = opts.monthNames;
        else
            monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        var showDays;
        if (typeof opts.showDays != "undefined")
            showDays = opts.showDays;
        else
            showDays = true;

        var popoverOptions;
        if (typeof opts.popoverOptions != "undefined")
            popoverOptions = opts.popoverOptions;
        else
            popoverOptions = {placement: 'bottom', html: true, trigger: 'hover'};

        var tooltipOptions;
        if (typeof opts.tooltipOptions != "undefined")
            tooltipOptions = opts.tooltipOptions;
        else
            tooltipOptions = {placement: 'bottom', trigger: 'hover'};

        var reqAjax;
        if (typeof opts.reqAjax != "undefined")
            reqAjax = opts.reqAjax;
        else
            reqAjax = false;

        var enableSelect = false;
        if (typeof opts.enableSelect != 'undefined')
            enableSelect = opts.enableSelect;

        var multiSelect = false;
        if (typeof opts.multiSelect != 'undefined')
            multiSelect = opts.multiSelect;

        var displayMonthController = true;
        if (typeof opts.displayMonthController != 'undefined')
            displayMonthController = opts.displayMonthController;

        var displayYearController = true;
        if (typeof opts.displayYearController != 'undefined')
            displayYearController = opts.displayYearController;

        var startWeekDay = 0;
        if (typeof opts.startWeekDay != 'undefined')
            startWeekDay = opts.startWeekDay;

        var firstDaySelected = '';
        var lastDaySelected = '';
        var daySelected = '';

        /*** --vars-- ***/





        /*** functions ***/

        /**
         * init n print calendar
         */
        function showCalendar() {

            //layer with the days of the month (literals)
            daysMonthLayer = $('<table class="table">');

            listListeralsWeek();

            //Date obj to calc the day
            var objFecha = new Date();

            //current year n current month
            var month = objFecha.getMonth();
            var year = objFecha.getFullYear();

            //show the days of the month n year configured
            showMonthDays(month, year);

            //next-previous month controllers
            var nextMonthButton = $('<td><a href="#" class="button-month-next"><i class="glyphicon glyphicon-arrow-right" ></i></a></td>');
            //event
            nextMonthButton.click(function(e) {
                e.preventDefault();
                month = (month + 1) % 12;
                if (month == 0)
                    year++;
                changeDate(month, year);
            })
            var previousMonthButton = $('<td><a href="#" class="button-month-previous"><i class="glyphicon glyphicon-arrow-left" ></i></a></td>');
            //event
            previousMonthButton.click(function(e) {
                e.preventDefault();
                month = (month - 1);
                if (month == -1) {
                    year--;
                    month = 11;
                }
                changeDate(month, year);
            })

            //next-previous year controllers
            var nextYearButton = $('<td><a href="#" class="button-year-next"><i class="glyphicon glyphicon-arrow-right" ></i></a></td>');
            //event
            nextYearButton.click(function(e) {
                e.preventDefault();
                year++;
                changeDate(month, year);
            })
            var previousYearButton = $('<td><a href="#" class="button-year-previous"><i class="glyphicon glyphicon-arrow-left" ></i></a></td>');
            //event
            previousYearButton.click(function(e) {
                e.preventDefault();
                year--;
                changeDate(month, year);
            })


            //show the current year n current month text layer
            var headerLayer = $('<table class="table header"></table>');

            if (displayYearController === true) {
                var yearTextLayer = $('<tr></tr>');
                var yearControlTextLayer = $('<td colspan=5 class="monthAndYear span6"></td>');

                yearTextLayer.append(previousYearButton);
                yearTextLayer.append(yearControlTextLayer);
                yearTextLayer.append(nextYearButton);
                yearControlTextLayer.append(textYearCurrentLayer);
                headerLayer.append(yearTextLayer);
            }
            if (displayMonthController === true) {
                var monthTextLayer = $('<tr></tr>');
                var monthControlTextLayer = $('<td colspan=5 class="monthAndYear span6"></td>');

                monthTextLayer.append(previousMonthButton);
                monthTextLayer.append(monthControlTextLayer);
                monthTextLayer.append(nextMonthButton);
                monthControlTextLayer.append(textMonthCurrentLayer);
                headerLayer.append(monthTextLayer);
            }

            //calendar n border
            calendar = $('<div class="bic_calendar row" id="' + calendarId + '" ></div>');
            calendar.prepend(headerLayer);
            //calendar.append(capaDiasSemana);
            //daysMonthLayer.prepend(capaDiasSemana);
            calendar.append(daysMonthLayer);

            //insert calendar in the document
            elem.append(calendar);

            //check and add events
            checkEvents(month, year);

            //if enable select
            checkIfEnableMark();
        }

        /**
         * indeed, change month or year
         */
        function changeDate(month, year) {
            daysMonthLayer.empty();
            listListeralsWeek();
            showMonthDays(month, year);
            checkEvents(month, year);
            markSelectedDays();
        }

        /**
         * show literals of the week
         */
        function listListeralsWeek() {
            if (showDays != false) {
                var capaDiasSemana = $('<tr class="days-month" >');
                var codigoInsertar = '';
                $(dayNames).each(function(indice, valor) {
                    codigoInsertar += '<td';
                    if (indice == 0) {
                        codigoInsertar += ' class="first"';
                    }
                    if (indice == 6) {
                        codigoInsertar += ' class="sunday last"';
                    }
                    codigoInsertar += ">" + valor + '</td>';
                });
                codigoInsertar += '</tr>';
                capaDiasSemana.append(codigoInsertar);

                daysMonthLayer.append(capaDiasSemana);
            }
        }

        /**
         * show the days of the month
         */
        function showMonthDays(month, year) {

            //print year n month in layers
            textMonthCurrentLayer.text(monthNames[month]);
            textYearCurrentLayer.text(year);

            //show days of the month
            var daysCounter = 1;

            //calc the date of the first day of this month
            var firstDay = calcNumberDayWeek(1, month, year);

            //calc the last day of this month
            var lastDayMonth = lastDay(month, year);

            var nMonth = month + 1;

            var daysMonthLayerString = "";

            //print the first row of the week
            for (var i = 0; i < 7; i++) {
                if (i < firstDay) {
                    var dayCode = "";
                    if (i == 0)
                        dayCode += "<tr>";
                    //add weekDay
                    dayCode += '<td class="invalid-day week-day-' + i + '"';
                    dayCode += '"></td>';
                } else {
                    var dayCode = "";
                    if (i == 0)
                        dayCode += '<tr>';
                    dayCode += '<td id="' + calendarId + '_' + daysCounter + "_" + nMonth + "_" + year + '" data-date="' + nMonth + "/" + daysCounter + "/" + year + '" ';
                    //add weekDay
                    dayCode += ' class="day week-day-' + i + '"';
                    dayCode += '><div><a>' + daysCounter + '</a></div></span>';
                    if (i == 6)
                        dayCode += '</tr>';
                    daysCounter++;
                }
                daysMonthLayerString += dayCode
            }

            //check all the other days until end of the month
            var currentWeekDay = 1;
            while (daysCounter <= lastDayMonth) {
                var dayCode = "";
                if (currentWeekDay % 7 == 1)
                    dayCode += "<tr>";
                dayCode += '<td id="' + calendarId + '_' + daysCounter + "_" + nMonth + "_" + year + '" data-date="' + nMonth + "/" + daysCounter + "/" + year + '" ';
                //add weekDay
                dayCode += ' class="day week-day-' + ((currentWeekDay - 1) % 7) + '"';
                dayCode += '><div><a>' + daysCounter + '</a></div></td>';
                if (currentWeekDay % 7 == 0)
                    dayCode += "</tr>";
                daysCounter++;
                currentWeekDay++;
                daysMonthLayerString += dayCode
            }

            //check if the empty cells it have yet to write of the last week of the month
            currentWeekDay--;
            if (currentWeekDay % 7 != 0) {
                dayCode = "";
                for (var i = (currentWeekDay % 7) + 1; i <= 7; i++) {
                    var dayCode = "";
                    dayCode += '<td ';
                    //add weekDay
                    dayCode += ' class="invalid-day week-day-' + (i - 1) + '"';
                    dayCode += '"></td>';
                    if (i == 7)
                        dayCode += '</tr>'
                    daysMonthLayerString += dayCode
                }
            }

            daysMonthLayer.append(daysMonthLayerString);
        }

        /**
         * calc the number of the week day
         */
        function calcNumberDayWeek(day, month, year) {
            var objFecha = new Date(year, month, day);
            var numDia = objFecha.getDay();
            numDia += startWeekDay;
            if (numDia == 0)
                numDia = 6;
            else
                numDia--;
            return numDia;
        }

        /**
         * check if a date is correct
         * 
         * @thanks http://kevin.vanzonneveld.net
         * @thanks http://www.desarrolloweb.com/manuales/manual-librerias-phpjs.html
         */
        function checkDate(m, d, y) {
            return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
        }

        /**
         * return last day of a date (month n year)
         */
        function lastDay(month, year) {
            var lastDayValue = 28;
            while (checkDate(month + 1, lastDayValue + 1, year)) {
                lastDayValue++;
            }
            return lastDayValue;
        }

        function validateWritedDate(fecha) {
            var arrayFecha = fecha.split("/");
            if (arrayFecha.length != 3)
                return false;
            return checkDate(arrayFecha[1], arrayFecha[0], arrayFecha[2]);
        }

        /**
         * check if there are ajax events
         */
        function checkEvents(month, year) {
            if (reqAjax != false) {
                //peticio ajax
                $.ajax({
                    type: reqAjax.type,
                    url: reqAjax.url,
                    data: {mes: month + 1, ano: year},
                    dataType: 'json'
                }).done(function(data) {

                    if (typeof events == 'undefined')
                        events = [];

                    $.each(data, function(k, v) {
                        events.push(data[k]);
                    });

                    markEvents(month, year);

                });
            } else {
                markEvents(month, year);
            }
        }

        /**
         * mark all the events n create logic for them
         */
        function markEvents(month, year) {
            var temporalMonth = month + 1;

            for (var i = 0; i < events.length; i++) {

                if (events[i].date.split('/')[1] == temporalMonth && events[i].date.split('/')[2] == year) {

                    var loopDayTd = $('#' + calendarId + '_' + events[i].date.replace(/\//g, "_"));
                    var loopDayA = $('#' + calendarId + '_' + events[i].date.replace(/\//g, "_") + ' a');

                    loopDayTd.addClass('event');

                    loopDayA.attr('data-original-title', events[i].title);

                    //bg color
                    if (events[i].color)
                        loopDayTd.css('background', events[i].color);

                    //link
                    if (typeof events[i].link != 'undefined' && events[i].link != '') {
                        loopDayA.attr('href', events[i].link);
                    }
                    if (typeof events[i].linkTarget != 'undefined' && events[i].linkTarget != '') {
                        loopDayA.attr('target', events[i].linkTarget);
                    }

                    //class
                    if (events[i].class)
                        loopDayTd.addClass(events[i].class);

                    //tooltip vs popover
                    if (events[i].content) {
                        loopDayTd.addClass('event_popover');
                        loopDayA.attr('rel', 'popover');
                        loopDayA.attr('data-content', events[i].content);
                    } else {
                        loopDayTd.addClass('event_tooltip');
                        loopDayA.attr('rel', 'tooltip');
                    }
                }
            }

            $('#' + calendarId + ' ' + '.event_tooltip a').tooltip(tooltipOptions);
            $('#' + calendarId + ' ' + '.event_popover a').popover(popoverOptions);

            $('.manual_popover').click(function() {
                $(this).popover('toggle');
            });
        }

        /**
         * check if the user can mark days
         */
        function checkIfEnableMark() {
            if (enableSelect == true) {

                var eventBicCalendarSelect;

                elem.on('click', 'td.day', function() {
                    //if multiSelect
                    if (multiSelect == true) {
                        if (daySelected == '') {
                            daySelected = $(this).data('date');
                            markSelectedDays();
                        } else {
                            if (lastDaySelected == '') {
                                //set firstDaySelected
                                firstDaySelected = daySelected;
                                lastDaySelected = $(this).data('date');

                                markSelectedDays();

                                //create n fire event
                                //to change
                                var eventBicCalendarSelect = new CustomEvent("bicCalendarSelect", {
                                    detail: {
                                        dateFirst: firstDaySelected,
                                        dateLast: lastDaySelected
                                    }
                                });
                                document.dispatchEvent(eventBicCalendarSelect);
                            } else {
                                firstDaySelected = '';
                                lastDaySelected = '';
                                daySelected = '';
                                elem.find('.selection').removeClass('middle-selection selection first-selection last-selection');
                            }
                        }
                    } else {
                        //remove the class selection of the others a
                        elem.find('td div').removeClass('selection');
                        //add class selection
                        $(this).find('div').addClass('selection');
                        //create n fire event
                        var eventBicCalendarSelect = new CustomEvent("bicCalendarSelect", {
                            detail: {
                                date: $(this).data('date')
                            }
                        });
                        document.dispatchEvent(eventBicCalendarSelect);
                    }
                })
            }
        }

        /**
         * to mark selected dates
         */
        function markSelectedDays() {
            if (daySelected != '' && firstDaySelected == '') {
                var arrayDate = daySelected.split('/');
                $('#bic_calendar_' + arrayDate[1] + '_' + arrayDate[0] + '_' + arrayDate[2] + ' div').addClass('selection');
            } else if (firstDaySelected != '') {
                //create array from dates
                var arrayFirstDay = firstDaySelected.split('/');
                var arrayLastDay = lastDaySelected.split('/');

                //remove all selected classes
                elem.find('td.selection').removeClass('selection');

                //create date object from dates
                var oldSelectedDate = new Date(firstDaySelected);
                var newSelectedDate = new Date(lastDaySelected);

                //create a loop adding day per loop to set days
                //turn dates if >
                if (oldSelectedDate > newSelectedDate) {
                    //turn vars date
                    var tempSelectedDate = oldSelectedDate;
                    oldSelectedDate = newSelectedDate;
                    newSelectedDate = tempSelectedDate;
                }
                //set first selection
                $('#bic_calendar_' + oldSelectedDate.getDate() + '_' + (parseInt(oldSelectedDate.getMonth()) + 1) + '_' + oldSelectedDate.getFullYear() + ' div').addClass('selection first-selection');
                while (oldSelectedDate < newSelectedDate) {
                    oldSelectedDate.setDate(oldSelectedDate.getDate() + 1);
                    //set middle-selection
                    $('#bic_calendar_' + oldSelectedDate.getDate() + '_' + (parseInt(oldSelectedDate.getMonth()) + 1) + '_' + oldSelectedDate.getFullYear() + ' div').addClass('selection middle-selection');
                }
                //set last selection
                $('#bic_calendar_' + oldSelectedDate.getDate() + '_' + (parseInt(oldSelectedDate.getMonth()) + 1) + '_' + oldSelectedDate.getFullYear() + ' div').removeClass('middle-selection').addClass('selection last-selection');
            }
        }

        /*** --functions-- ***/



        //fire calendar!
        showCalendar();


    });
    return this;
};
