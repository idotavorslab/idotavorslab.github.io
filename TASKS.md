#####
TODO:
#####

MORKI:
    
    Navbar:
        [x] Everything aligned to "0" (left of 1200px), besides last (right) one aligned right
    
    Research:
        Adhere to regular grid (1200 etc)
    
    People:
        [x] Align pictures to left (no weird padding compared to title)
        open the viewer beneath given person. viewer's width is 2 people wide. 
            person is always on the left side of viewer. see morki structure example.jpg 
    
    Publications:
        Hover on publication as 1 unit, drop shadow
        morki publications structure.png

Home
    [ ] News
        [ ] Stop cycling on user interaction

Gallery
    [ ] Sorted by year?
    [ ] Going between photos like in mudriks
    [ ] Meshes? sketchfab api or files?
    [ ] Tooltip?
    [ ] python script to popuplate json?
    
Publications
    [x] Sorted by year
    [x] Structure like http://neuroimaging.tau.ac.il/?page_id=19 
    [ ] Each year is expandable
    [x] Visual like Ron Shamirs with thumbnail http://acgt.cs.tau.ac.il/latest-years-publications/
    
Courses
    "pretty mobile-like", not a list. image, title, text, link. http://schonberglab.tau.ac.il/funding/



Funding
    (logo, title, subtitle) http://schonberglab.tau.ac.il/funding/


Contact
    lab twitter
    recruiting link


People
    [x] email hyperlink
    [ ] Fix People viewer proportions

Home - structure like ron shamir's
    Our Lab (where ron's "ACGT"): image like ACGT, then a small title like mudriks, and some text
    Research "box" - where ron's squares. only titles and a thumbnail. gets thumbnails from research.json "thumbnail" field.  
        square boxes with thumbnail in bg and title on top
    News - where and like ron's, square small pic like mudriks, then title and subtitle
    
####
DEV:
####
betterhtmlelement.js is downloaded with sourcemapping: all.js
