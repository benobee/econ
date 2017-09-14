(function() {
    const Site = {
        init() {
            this.services({
                id: "#collection-5983949b8419c27e05553028"
            });
            this.innovation({
                id: "#collection-598385dfe45a7c8bbb2c37fa"
            });
            this.staff({
                id: "#collection-59837989579fb3d95a4103cc"
            });
        },
        modals(target) {
            $(target).on("click", (e) => {
                const clone = $(e.currentTarget).clone();
                
                const target = $(".modal-content").html(clone);

                $(".modal-body").addClass("active");
                $(".modal-body, .close").on("click", () => {
                    $(".modal-body").removeClass("active");
                    $(target).off();
                });

                $(".modal-content-wrapper").on("click", (e) => {
                    e.stopPropagation();
                });
            });
        },
        subnav() {
            $("*[id*=subnav] li:first-child a").addClass("active");

            //check for hash and navigate to correct sub section
            const hash = window.location.hash.replace("#", "");

            if (hash) {
                this.makeActivePage(hash);
            }

            $("*[id*=subnav] a").on("click", (e) => {
                e.preventDefault();
                const href = $(e.currentTarget).attr("href").replace("/", "").replace("?page=", "");

                this.makeActivePage(href);
            });
        },
        innovation(collection) {
            const page = $(collection.id);

            if (page.length === 0) {
                return false;
            }

            this.subnav(collection.id);
        },
        services(collection) {
            const page = $(collection.id);

            if (page.length === 0) {
                return false;
            }

            this.subnav(collection.id);

            //bind modals
            this.modals("#litigation-areas-of-expertise .sqs-col-6, #natural-resources .sqs-col-6, #business-economics .sqs-col-6, #development-and-transportation .sqs-col-6, #social-policy .sqs-col-6");
            this.modals("#litigation .hentry");

            //handle accordion style content reveals
            $("section:not(*[id*=litigation]) .sqs-block-html:not(:nth-child(1))").on("click", (e) => {
                $(e.currentTarget).toggleClass("active");
            });

        },
        makeActivePage(href) {
            window.location.hash = href;

            const target = $("*[id*='" + href + "']");

            $("*[id*=subnav] a").removeClass("active").addClass("inactive");
            $("*[id*=subnav] a[href*=" + href + "]").addClass("active").removeClass("inactive");
            $("section").addClass("hidden").removeClass("active");
            $(target).removeClass("hidden").addClass("active");
        },
        get(page) {
            return $.ajax({
                url: page,
                data: {
                    format: "json"
                },
                success(response) {
                    return response;
                },
                error(error) {
                    console.error(error);
                }
            });
        },
        staff(collection) {
            const page = $(collection.id);

            if (page.length === 0) {
                return false;
            }

            //populate the dropdowns
            const data = this.get("/staff-gallery");

            $.when(data).done((response) => {
                //render area dropdown
                $.each(response.collection.categories, (i, item) => {
                    let itemTitle = item;

                    if (item == "Development") {
                        itemTitle = "Development & Transportation";
                    }

                    const html = `<option value="category-${item}">${itemTitle}</option>`;

                    $(".category.filter select").append(html);
                });
                //render loaction dropdown
                $.each(response.collection.tags, (i, item) => {
                    const html = `<option value="tag-${item}">${item}</option>`;

                    $(".tag.filter select").append(html);
                });
            });

            //bind filters
            let search = {};

            $(".filter-wrapper select").on("change", (e) => {
                const tag = e.currentTarget.value.toLowerCase().replace(/ /g, "-").replace(/-&-/g, "-");
                const category = $(e.currentTarget)[0].dataset.category;

                if (tag === "all") {
                    search[category] = ".hentry";
                } else {
                    search[category] = "." + tag;
                }

                const values = Object.values(search);

                $(".collection-list.grid").removeClass("no-results");
                $(".hentry").removeClass("hide");
                $(".hentry:not(" + values.join("") + ")").addClass("hide");

                const results = $(".hentry:not(.hide)");

                if (results.length === 0) {
                    $(".collection-list").addClass("no-results");
                }
            });

            //bind box click events for modals
            this.modals(".hentry");
        }
    };

    Site.init();

})();