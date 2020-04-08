console.log("Utility");

const toolTipContainerStyle = ''
    // 'padding:10px;background-color:rgba(0,0,0,0.8);text-align:left;color:#F79A2A;border-radius:10px;height:150px;width:450px';


function formatToolTip(player, stat){
    return `<div class="tool-tip"` +
        "<h2 style='font-weight:700'>"+ player + "</h2>" +
        "<span>Stat:</span><br/>"+
        "<span style=''>Value:" + stat + "</span>"
        "</div>";
}