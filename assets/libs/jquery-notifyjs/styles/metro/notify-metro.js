$.notify.addStyle("metro", {
    html:
        "<div>" +
            "<div class='image' data-notify-html='image'/>" +
            "<div class='text-wrapper'>" +
                "<div class='title' data-notify-html='title'/>" +
                "<div class='text' data-notify-html='text'/>" +
            "</div>" +
        "</div>",
    classes: {
        default: {
            "color": "#fafafa !important",
            "background-color": "#ABB7B7",
            "border": "1px solid #ABB7B7"
        },
        error: {
            "color": "#fafafa !important",
            "background-color": "#E15554",
            "border": "1px solid #E15554"
        },
        success: {
            "color": "#fafafa !important",
            "background-color": "#68C39F",
            "border": "1px solid #68C39F"
        },
        info: {
            "color": "#fafafa !important",
            "background-color": "#65BBD6",
            "border": "1px solid #65BBD6"
        },
        warning: {
            "color": "#fafafa !important",
            "background-color": "#FFC052",
            "border": "1px solid #FFC052"
        },
        black: {
            "color": "#fafafa !important",
            "background-color": "#333",
            "border": "1px solid #000"
        },
        cool: {
            "color": "#fafafa !important",
            "background-color": "#4A525F",
            "border": "1px solid #4A525F"
        },
        nonspaced: {
            "color": "#fafafa !important",
            "background-color": "#4A525F",
            "min-width": "150px",
            "border": "1px solid #4A525F"
        },
        white: {
            "background-color": "#f1f1f1",
            "border": "1px solid #ddd"
        }
    }
});