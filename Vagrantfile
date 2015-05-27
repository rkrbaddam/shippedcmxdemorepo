Vagrant.require_version ">= 1.6.0"
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
	config.vm.define "dockerhost-static-expresscmx", autostart: false do |docker|
  	docker.vm.provision "docker"
  	docker.vm.box = "yungsang/boot2docker"
  	docker.vm.box_check_update = false
        docker.vm.network "forwarded_port", guest: 2735, host: 2375, auto_correct: true
  	docker.vm.network "forwarded_port", guest: 33002, host: 33002, auto_correct: true
  	docker.vm.provider :virtualbox do |vb|
  		vb.name = "dockerhost-static-expresscmx"
  	end
  end

  
  
 config.vm.define "expresscmx" do |svc|
      svc.vm.provider "docker" do |d|
        d.build_dir = "../"
        d.ports = ["33002:3000"]
        d.name = "expresscmx"
        
        d.vagrant_vagrantfile = "./Vagrantfile"
        d.vagrant_machine = "dockerhost-static-expresscmx"
      end
    end
  
end
