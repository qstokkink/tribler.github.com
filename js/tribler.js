$(document).ready(function() {
    pagename = location.href.substring(location.href.lastIndexOf('/')+1);
    if(pagename == "linux.html") {
        $("#debian-install-code").hide()
    }
    else if(pagename == "download.html") {
        $(".downloads-content").hide()
    }

    $.get("https://api.github.com/repos/Tribler/tribler/releases", function (data) {
        var total = 0;
        var stablerelease = undefined;
        var prevrelease = undefined;
        $.each(data, function (index, release) {
            $.each(release["assets"], function (index2, asset) {
                total += asset["download_count"];
            });

            if (!release["prerelease"] && !stablerelease) {
                // we found a stable release; update fields
                stablerelease = release;
                $("#main_download_url").text("Download Tribler " + release["name"].substring(1))
                $("#footer_download_url").text("Download Tribler " + release["name"].substring(1))
            }
            else if(!release["prerelease"] && !prevrelease && stablerelease) {
                prevrelease = release;
            }
        });

        // find the right assets in the stable release
        windows64_url = undefined;
        windows32_url = undefined;
        mac_url = undefined;
        linux_url = undefined;
        linux_file_name = undefined;
        source_url = undefined;
        $.each(stablerelease["assets"], function(index, asset) {
            if(asset["name"].endsWith(".dmg")) {
                mac_url = asset["browser_download_url"];
            }
            else if(asset["name"].endsWith(".deb")) {
                linux_url = asset["browser_download_url"];
                linux_file_name = asset["name"];
            }
            else if(asset["name"].endsWith("x86.exe")) {
                windows32_url = asset["browser_download_url"];
            }
            else if(asset["name"].endsWith("x64.exe")) {
                windows64_url = asset["browser_download_url"];
            }
            else if(asset["name"].endsWith("tar.xz")) {
                source_url = asset["browser_download_url"];
            }
        });

        if(typeof(isfront) !== 'undefined') {
            $("#total_downloads_all_versions").html(total);

            // set download URLs
            var parser = new UAParser();
            var result = parser.getResult();
            var osName = result.os.name.toLowerCase();
            if (osName == "windows") {
                $("#download_os").html("For Windows 7/8/10");
                $("#main_download_url").attr("href", windows64_url);
                $("#footer_download_url").attr("href", windows64_url);
            }
            else if (osName == "mac os x") {
                $("#download_os").html("For macOS (Yosemite or later)");
                $("#main_download_url").attr("href", mac_url);
                $("#footer_download_url").attr("href", mac_url);
            }
            else if (jQuery.inArray(osName, new Array('kubuntu', 'xubuntu', 'lubuntu', 'ubuntu', 'gentoo', 'fedora', 'mandriva', 'redhat', 'suse', 'debian', 'slackware', 'arch', 'linux')) !== -1) {
                $("#download_os").html("For Linux");
                $("#main_download_url").attr("href", linux_url);
                $("#footer_download_url").attr("href", linux_url);
                $("#instructions").html("Installation instructions for Linux");
                $("#instructions").css("display", "block");
                $("#instructions").attr("href", "./linux.html");
            }
            else {
                $("#download_os").html("Unknown OS");
                $("#main_download_url").attr("href","download.html");
                $("#footer_download_url").attr("href","download.html");
            }
        }
        else if(pagename == "linux.html") {
            $("#linux-content-header").text("Latest release - Tribler " + stablerelease["name"].substring(1));
            $("#debian-download-url").attr("href", linux_url);
            $("#debian-download-url").text("Download " + stablerelease["name"].substring(1));
            $("#tribler-source-url").attr("href", source_url);
            $("#tribler-source-tree-url").attr("href", 'https://github.com/Tribler/tribler/tree/' + stablerelease['tag_name']);

            $("#debian-install-code-url").text(linux_url);
            $("#debian-install-code-file").text("./" + linux_file_name);
            $("#debian-install-code").show();
        }
        else if(pagename == "download.html") {
            $("#download-url-win64").attr("href", windows64_url);
            $("#download-url-win32").attr("href", windows32_url);
            $("#download-url-mac").attr("href", mac_url);
            $("#download-url-linux").attr("href", linux_url);
            $("#tribler-source-url").attr("href", source_url);
            $(".tribler-source-tree-url").attr("href", 'https://github.com/Tribler/tribler/tree/' + stablerelease['tag_name']);
            $(".downloads-content").show()
            $("#github-compare-url").attr("href", 'https://github.com/Tribler/tribler/compare/' + prevrelease['tag_name'] + '...' + stablerelease['tag_name'])
        }

    });
});