define([
    "react",
    "app",
    "cmpld/authorized/mailbox/leftpanel/folderList",
    "cmpld/authorized/mailbox/middlepanel/emailList",
    "cmpld/authorized/mailbox/rightpanel/emailRead",
    "cmpld/authorized/header/head",
    "cmpld/authorized/canvas/canvasCollection",
], function (React, app, FolderList, EmailList, EmailRead, Header, Canvas) {
    return React.createClass({
        render: function () {
            return (
                <div>
                    <Canvas />
                    <Header changeFodlerId={this.changeFodlerId} />
                    <FolderList
                        activePage={this.props.activePage}
                        changeFodlerId={this.props.changeFodlerId}
                        panel={this.state}
                        updateValue={this.updateValue}
                        resetClasses={this.resetClases}
                    />
                    <EmailList
                        folderId={this.props.folderId}
                        panel={this.state}
                        updateValue={this.updateValue}
                        resetClasses={this.resetClases}
                    />
                    <EmailRead
                        panel={this.state}
                        updateValue={this.updateValue}
                        resetClasses={this.resetClases}
                    />
                </div>
            );
        },
    });
});
