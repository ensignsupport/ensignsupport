set -e
cd /tmp/claude-0/p3/comp
python3 build_refer.py >/dev/null
for b in build_home.py build_services2.py build_about.py build_refer_page.py build_contact.py build_contact2.py build_privacy.py; do python3 $b >/dev/null; done
python3 build_hero7.py ${ARR:-A}
python3 link_pages.py ensign-home.html ensign-services.html ensign-about.html ensign-refer.html ensign-contact.html ensign-404.html ensign-privacy.html
python3 smart_quotes.py ensign-home.html ensign-services.html ensign-about.html ensign-refer.html ensign-contact.html ensign-404.html ensign-privacy.html
python3 menu.py ensign-home.html ensign-services.html ensign-about.html ensign-refer.html ensign-contact.html ensign-404.html ensign-privacy.html
python3 stick_head.py ensign-home.html ensign-services.html ensign-about.html ensign-refer.html ensign-contact.html ensign-404.html ensign-privacy.html ensign-admin.html
python3 add_dev.py ensign-home.html ensign-services.html ensign-about.html ensign-refer.html ensign-contact.html ensign-404.html ensign-privacy.html ensign-admin.html
