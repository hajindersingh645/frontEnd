define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                moveFolderMain: [],
                moveFolderCust: [],
                checkNewMails: false,
                trashStatus: false,
                spamStatus: false,
                blackList: false,
                pastDue: false,
                balanceShort: false,
                hidden: true,
            };
        },

        change: function (event) {
            console.log(event.target.value);
            // $("#emailListTable")
            //     .DataTable()
            //     .column(0)
            //     .search(event.target.value, 0, 1)
            //     .draw();
        },

        render: function () {
            return (
                <div className="desktop-search">
                    <input
                        type="search"
                        placeholder="Search..."
                        onChange={this.change.bind(this)}
                    />
                </div>
            );
        },
    });
});
