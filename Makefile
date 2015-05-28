
clean_cmxdemo:
	cd .shipped && vagrant halt shipped-cmxdemo
compile_cmxdemo:
	/app/bin/build
destroy_cmxdemo:
	cd .shipped && vagrant destroy
run_cmxdemo:
	cd .shipped && vagrant reload shipped-cmxdemo
start_cmxdemo:
	cd .shipped && vagrant up
status_cmxdemo:
	cd .shipped && vagrant status
test_cmxdemo:
	/app/bin/test

clean: clean_cmxdemo
compile: compile_cmxdemo
destroy: destroy_cmxdemo
run: run_cmxdemo
start: start_cmxdemo
status: status_cmxdemo
test: test_cmxdemo
