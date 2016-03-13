VERSION=0.0.1
NOMBRE="demo-editor"

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m
PHASER_VERSION="v2.4.6"

define log
	@echo "${G}▷$(1) ${N}"
endef

define task
	@echo ""
	@echo "${Y}-$(1)${N}"
endef

comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${Y}${NOMBRE}${N} (versión: ${VERSION})"
	@echo ""
	@echo "  ${Y}Para desarrolladores${N}"
	@echo ""
	@echo "    ${G}iniciar${N}                Instala dependencias."
	@echo "    ${G}electron${N}               Compila y ejecuta electron (modo live)."
	@echo "    ${G}pilas${N}                  Genera pilasengine.js."
	@echo "    ${G}pilas_live${N}             Genera pilasengine.js (modo live)."
	@echo "    ${G}pilas_ejemplos_live${N}    Genera pilasengine.js y ejemplos (live)."
	@echo ""
	@echo "  ${Y}Para distribuir${N}"
	@echo ""
	@echo "    ${G}version_patch${N}          Genera una nueva versión."
	@echo "    ${G}version_minor${N}          Genera una nueva versión."
	@echo "    ${G}subir_version${N}          Sube version generada al servidor."
	@echo ""

_crear_enlaces:
	$(call log, "Creando enlaces a vendor y data.")
	@cd pilasengine/ejemplos; rm -rf vendor data; ln -s ../../vendor; ln -s ../../public/data

iniciar:
	$(call task, "Iniciando el proyecto.")
	$(call log, "Instalando dependencias.")
	@npm install
	@bower install
	$(call log, "Instalando dependencias de pilas-engine")
	@cd pilasengine; npm install
	@make _crear_enlaces
	@make _instalar_phaser

_instalar_phaser:
	$(call log, "Descargando phaser.js ...")
	@wget -q https://raw.githubusercontent.com/photonstorm/phaser/${PHASER_VERSION}/build/phaser.js
	$(call log, "Descargando definiciones de typescript ...")
	@wget -q https://raw.githubusercontent.com/photonstorm/phaser/master/typescript/phaser.d.ts
	@wget -q https://raw.githubusercontent.com/photonstorm/phaser/master/typescript/pixi.d.ts
	@wget -q https://raw.githubusercontent.com/photonstorm/phaser/master/typescript/p2.d.ts
	@mv phaser.d.ts pilasengine/libs/
	@mv pixi.d.ts pilasengine/libs/
	@mv p2.d.ts pilasengine/libs/
	@mv phaser.js public/libs/

version_patch:
	@bumpversion patch --current-version ${VERSION} Makefile --list
	make _help_version

version_minor:
	@bumpversion minor --current-version ${VERSION} Makefile --list
	make _help_version

_help_version:
	@echo "Es recomendable escribir el comando que genera los tags y sube todo a github:"
	@echo ""
	@echo "make subir_version"

ver_sync: subir_version

subir_version:
	git commit -am 'release ${VERSION}'
	git tag '${VERSION}'
	git push
	git push --all
	git push --tags
	make changelog
	@git add CHANGELOG.txt
	@git commit -m "actualizando changelog."
	@git push

electron:
	ember build
	electron dist &
	ember build --watch

changelog:
	@git log `git describe --tags --abbrev=0` --pretty=format:"  * %s" > CHANGELOG.txt
	@echo "Generando el archivo CHANGELOG.txt"

pilasengine/node_modules:
	$(call log, "Instalando dependencias de pilas-engine")
	@cd pilasengine; npm install

pilas: pilasengine/node_modules
	$(call log, "Compilando pilas-engine")
	@grunt --gruntfile pilasengine/Gruntfile.js compilar --base pilasengine

pilas_live:
	$(call log, "Compilando pilas-engine en modo live")
	@grunt --gruntfile pilasengine/Gruntfile.js compilar-y-notificar-live --base pilasengine

pilas_ejemplos_live:
	$(call log, "Compilando ejemplos de pilas-engine en modo live")
	@grunt --gruntfile pilasengine/Gruntfile.js compilar-con-ejemplos-livereload --base pilasengine

.PHONY: tmp
